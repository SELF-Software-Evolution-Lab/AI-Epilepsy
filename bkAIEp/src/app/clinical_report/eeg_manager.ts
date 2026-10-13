import { getSignal, openEdf, readWindow, toPhysical } from 'edfcore';
import { fileSource } from 'edfcore/node';

export class EEG_manager {

  public static async loadEDF_file() {
    const source = await fileSource("../../../seed_data/examsToAssociate/lastEEG_Patient1/lastEEG_Patient1.edf");
    try {
      const recording = await openEdf(source);
      const { header } = recording;

      console.log(`${header.variant}: ${header.recordCount} records of ${header.recordDurationSeconds} s`);
      for (const signal of header.signals) {
        console.log(
          `[${signal.index}] ${signal.label} — ${signal.kind}, ` +
          `${signal.samplesPerRecord} samples/record`,
        );
      }

      const eeg = getSignal(header, 'EEG Fpz-Cz');
      const chunks = await readWindow(recording, {
        startSeconds: 60,
        durationSeconds: 10,
        signalIndices: [eeg.index],
      });

      const chunk = chunks[0];
      if (chunk !== undefined) {
        const microvolts = toPhysical(eeg, chunk.signals[0]!.digital);
        console.log(`${microvolts.length} samples, ${chunk.byteLength} bytes read`);
        console.log(Array.from(microvolts.subarray(0, 5)));
      }
    } finally {
      await source.close?.();
    }
  }
}
