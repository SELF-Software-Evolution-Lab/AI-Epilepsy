import path from 'path';

export class EEG_manager {

  public static async loadEDF_file(startSeconds, durationSeconds) {
    const dynamicImport = new Function('specifier', 'return import(specifier)');
    const { openEdf, readWindow, toPhysical } = await dynamicImport('edfcore');
    const { fileSource } = await dynamicImport('edfcore/node');

    const edfPath = path.join(__dirname, '../../../seed_data/examsToAssociate/lastEEG_Patient1/lastEEG_Patient1.edf');
    const source = await fileSource(edfPath);
    
    try {
      const recording = await openEdf(source);
      const { header } = recording;
      const selectedSignals = header.signals.filter((signal: any) => signal.label !== 'EDF Annotations');
      const signalIndices = selectedSignals.map((s: any) => s.index);

      const chunks = await readWindow(recording, {
        startSeconds: startSeconds,
        durationSeconds: durationSeconds, 
        signalIndices: signalIndices,
      });

      const chunk = chunks[0];
      const chartData: Record<string, number[]> = {};

      if (chunk !== undefined) {
        selectedSignals.forEach((signal: any, index: number) => {
          const microvolts = toPhysical(signal, chunk.signals[index]!.digital);
          chartData[signal.label] = Array.from(microvolts); 
        });

        return chartData;
      }
    } finally {
      await source.close?.();
    }
  }

  public static async generateEEG_chart(chartData: Record<string, number[]>) {
    // @ts-ignore
    const echarts = require('echarts');
    const sampleCount = Object.values(chartData)[0].length;
    const labels = Array.from({ length: sampleCount }, (_, i) => i.toString());

    const chart = echarts.init(null, null, {
      renderer: 'svg',
      ssr: true, 
      width: 800,
      height: 500
    });

    const series = Object.keys(chartData).map((label) => ({
      name: label,
      type: 'line',
      data: chartData[label],
      showSymbol: false, 
      lineStyle: { width: 1.5 }
    }));

    chart.setOption({
      animation: false, 
      backgroundColor: '#ffffff', 
      grid: {
        left: 50,
        right: 100,
        top: 20,
        bottom: 20
      },
      xAxis: { 
        type: 'category', 
        data: labels,
      },
      yAxis: { 
        type: 'value',
        name: 'Microvoltios (µV)'
      },
      series: series,
      legend: { 
        show: true, 
        right: 0, 
        top: 'middle',
        orient: 'vertical',
        itemGap: 5,
        itemWidth: 15,
        textStyle: {
          fontSize: 9
        }
      }
    });

    const svgString = chart.renderToSVGString();

    return {
      svg: svgString,
      width: 500,
      alignment: 'center',
      margin: [0, 10, 0, 10]
    };
  }
}