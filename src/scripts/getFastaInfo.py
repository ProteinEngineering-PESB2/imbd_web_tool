import sys
from Bio import SeqIO
import json
def is_fasta(filename):
    with open(filename, "r") as handle:
        fasta = SeqIO.parse(handle, "fasta")
        num_sequences= list(SeqIO.parse(filename, "fasta"))
        return any(fasta),len(num_sequences) # False when `fasta` is empty, i.e. wasn't a FASTA file
fasta_in= sys.argv[1]
fasta_check, fasta_len= (is_fasta(fasta_in))
response = {'sequences': []}
if(fasta_check):
    for record in SeqIO.parse(fasta_in, "fasta"):
        row = {'id': record.id, 'seq': str(record.seq)}
        response['sequences'].append(row)
print(json.dumps(response))