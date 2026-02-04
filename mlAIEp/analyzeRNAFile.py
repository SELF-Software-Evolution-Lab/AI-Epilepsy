def analyzeRNAFile(text_file):
    import csv
    result={}
    knownRNAIds = loadKnownRNAIds()
    with open(text_file, 'r') as f:
        reader = csv.reader(f, delimiter=',')
        for row in reader:
            if row[0] in knownRNAIds :
                print ("Found id "+row[0]+" in known ids. Value: "+row[1])
                result[row[0]] = row[1]
    return result
    
def loadKnownRNAIds() :
    result=[]
    with open("knownMiRNA.txt", 'r') as f:
        for line in f:
            result.append(line)
    return result
