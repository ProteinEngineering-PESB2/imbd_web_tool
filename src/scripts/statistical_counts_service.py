import pandas as pd
import sys
from Bio import SeqIO
import json
import numpy as np

def is_fasta(filename):
    with open(filename, "r") as handle:
        fasta = SeqIO.parse(handle, "fasta")
        num_sequences= list(SeqIO.parse(filename, "fasta"))
        return any(fasta),len(num_sequences) # False when `fasta` is empty, i.e. wasn't a FASTA file

def count_values_residues(sequence, canonical_residues):

	dict_value = {residue:sequence.count(residue)/len(sequence)*100 for residue in canonical_residues}
	return dict_value

def count_values_by_group(sequence, group_residues):

	dict_value = {}
	for group in group_residues:
		cont=0
		for residue in sequence:
			if residue in group_residues[group]:
				cont+=1
		dict_value.update({group:cont*100/len(sequence)})	

	return dict_value

def create_dict_response(dict_statistical_data):

	residues_values = []
	residues_mean = []
	residues_std = []

	for residue in dict_statistical_data:
		mean_data=0
		std_data=0
		
		try:
			mean_data = np.mean(dict_statistical_data[residue])
		except:
			pass

		try:
			std_data = np.std(dict_statistical_data[residue])
		except:
			pass

		residues_values.append(residue)
		residues_mean.append(mean_data)
		residues_std.append(std_data)

	
	dict_statistical_summary = {"array_keys":residues_values, "mean_values":residues_mean, "std_values":residues_std}
	return dict_statistical_summary

def make_statistical_summary(array_data, canonical_data, data_groups):

	dict_response_statistical = {residue:[] for residue in canonical_data}
	dict_response_statistical_groups = {group:[] for group in data_groups}

	number_sequences =0

	for element in array_data:
		if element['status_process'] == "OK":

			for residue in canonical_data:
				dict_response_statistical[residue].append(float(element["canonical_residues"][residue]))

			for group in data_groups:
				dict_response_statistical_groups[group].append(float(element["group_residues"][group]))

	dict_response_residues = create_dict_response(dict_response_statistical)
	dict_response_groups = create_dict_response(dict_response_statistical_groups)

	dict_summary = {"statistic_residues":dict_response_residues, "statistic_groups":dict_response_groups}

	return dict_summary

fasta_sequence = sys.argv[1]

fasta_check, fasta_len= (is_fasta(fasta_sequence))
dict_response = {}

if fasta_check:
	dict_response.update({"fasta_check":"OK"})
	
	if fasta_len <=50:
		dict_response.update({"fasta_length":"OK"})
		#auxiliar variables
		canonical_residues = ["A","R","N","D","C","Q","E","G","H","I","L","K","M","F","P","S","T","W","Y","V"]
		groups={"non_polar_aliphatic" : ["G", "A", "L", "I", "M", "V", "P"], "polar_not_charge": ["S", "T", "C", "N", "Q"], "aromatic": ["F", "Y", "W"], "positive_charge": ["K", "H", "R"], "negative_charge": ["D", "E"]}

		array_response = []

		for record in SeqIO.parse(fasta_sequence, "fasta"):
			dict_value = {"id_sequence":record.id}
			try:
				sequence = [residue for residue in record.seq]
				sequence = ''.join(map(str, sequence))
				sequence = sequence.upper()

				#get values for residues
				dict_value.update({"status_process":"OK"})
				dict_value.update({"canonical_residues":count_values_residues(sequence, canonical_residues)})
				dict_value.update({"group_residues":count_values_by_group(sequence, groups)})
			except:
				dict_value.update({"status_process":"ERR"})
			array_response.append(dict_value)

		#process array and get get statistical features
		statistical_values_residues = make_statistical_summary(array_response, canonical_residues, groups)
		dict_response.update({"statistical_process":array_response})
		dict_response.update({"statistical_summary":statistical_values_residues})

	else:
		dict_response.update({"fasta_length":"ERR"})
else:
	dict_response.update({"fasta_check":"ERR"})

print(json.dumps(dict_response))
