import csv
import copy

def loadKnownRNAIds():
    """Executed only once at start up, to improve time performance."""

    list_knownARN_IDs = []
    dict_ARNcount = {}
    with open("knownMiRNA.txt", 'r') as f:
        for line in f:
            miARN_id, lim_inf, lim_sup = line.strip().split(",")
            list_knownARN_IDs.append(miARN_id)
            dict_ARNcount[miARN_id] = {"count":0, "lim_inf":lim_inf, "lim_sup":lim_sup}
            
    return set(list_knownARN_IDs), dict_ARNcount

GLOBAL_KNOWN_RNA_IDS, GLOBAL_DICT_TEMPLATE = loadKnownRNAIds()


def analyzeRNAFile(text_file):
    """Executed per incoming prediction message. 
       Copies dictionary template and maps the new data."""

    current_dict_RNAcount = copy.deepcopy(GLOBAL_DICT_TEMPLATE)


    with open(text_file, 'r') as f:
        reader = csv.reader(f, delimiter=',')
        for row in reader:
            miARN_id = row[0]
            if miARN_id in GLOBAL_KNOWN_RNA_IDS:
                current_dict_RNAcount[miARN_id]["count"] = row[1]

    return current_dict_RNAcount



