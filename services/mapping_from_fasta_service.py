import pandas as pd
import sys
from Bio import SeqIO
import json
import re

def is_fasta(filename):
    with open(filename, "r") as handle:
        fasta = SeqIO.parse(handle, "fasta")
        num_sequences= list(SeqIO.parse(filename, "fasta"))
        return any(fasta),len(num_sequences) # False when `fasta` is empty, i.e. wasn't a FASTA file

def mapping_string(string_value, sequence):

	response = [data.start() for data in re.finditer(string_value, sequence)]

	if len(response)>0:
		number_data = sequence.count(string_value)

		dict_value = {"positions": response, "coincidences":number_data}
		return dict_value
	else:
		return "ERR"

#params
string_map = sys.argv[1]#string to search	
fasta_seq = sys.argv[2]#fasta file sequence

fasta_check, fasta_len= (is_fasta(fasta_seq))
dict_responses = {}

if len(string_map)>=5 and len(string_map)<=30:
	dict_responses.update({"length_string_map":"OK"})

	if fasta_check:
		dict_responses.update({"fasta_status":"OK"})

		if fasta_len <=50:
			dict_responses.update({"length_status":"OK"})
			dict_response_array = []
			for record in SeqIO.parse(fasta_seq, "fasta"):				
				try:
					id_sequence = record.id
					sequence = [residue for residue in record.seq]
					sequence = ''.join(map(str, sequence))

					dict_response_search = {"id_sequence":id_sequence}

					#search using method
					dict_response_search.update({"response_search":mapping_string(string_map, sequence)})
					dict_response_array.append(dict_response_search)
				except:
					dict_response_array.append({"id_sequence":record.id, "status_service": "ERR"})
			dict_responses.update({"mapping_service":dict_response_array})
		else:
			dict_responses.update({"length_status":"ERR"})
	else:
		dict_responses.update({"fasta_status":"ERR"})
else:
	dict_responses.update({"length_string_map":"ERR"})

print(json.dumps(dict_responses))
