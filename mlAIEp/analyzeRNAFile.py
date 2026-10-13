def analyzeRNAFile(text_file):
    import csv
    knownRNAIds, dict_ARNcount = loadKnownRNAIds()

    with open(text_file, 'r') as f:
        reader = csv.reader(f, delimiter=',')
        for row in reader:
            miARN_id = row[0]
            if miARN_id in knownRNAIds:
                dict_ARNcount[miARN_id]["count"] = row[1]

    return dict_ARNcount
    
def loadKnownRNAIds():
    list_knownARN_IDs = []
    dict_ARNcount = {}
    with open("knownMiRNA.txt", 'r') as f:
        for line in f:
            [miARN_id, lim_inf, lim_sup] = line.strip().split(",")
            list_knownARN_IDs.append(miARN_id)
            dict_ARNcount[miARN_id] = {"count":0, "lim_inf":lim_inf, "lim_sup":lim_sup}
    return (list_knownARN_IDs, dict_ARNcount)
