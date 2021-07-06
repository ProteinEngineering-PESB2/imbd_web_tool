from modlamp.descriptors import GlobalDescriptor
import sys
from Bio import SeqIO
import json
def is_fasta(filename):
    with open(filename, "r") as handle:
        fasta = SeqIO.parse(handle, "fasta")
        num_sequences= list(SeqIO.parse(filename, "fasta"))
        return any(fasta),len(num_sequences) # False when `fasta` is empty, i.e. wasn't a FASTA file
def get_physicochemical_properties(sequence):
	dict_response = {}
	desc = GlobalDescriptor([sequence])
	#length
	try:
		desc.length()
		dict_response.update({"length":desc.descriptor[0][0]})		
	except:
		dict_response.update({"length":"ERR"})
	#molecular weigth
	try:
		desc.calculate_MW(amide=True)
		dict_response.update({"MolecularWeight":desc.descriptor[0][0]})
	except:
		dict_response.update({"MolecularWeight":"ERR"})
	try:
		#isoelectrical point
		desc.isoelectric_point(amide=True)
		dict_response.update({"Isoelectric_point":desc.descriptor[0][0]})
	except:
		dict_response.update({"Isoelectric_point":"ERR"})
	try:
		#charge density
		desc.charge_density(ph=7, amide=True)
		dict_response.update({"Charge_density":desc.descriptor[0][0]})
	except:
		dict_response.update({"Charge_density":"ERR"})
	try:
		#chage
		desc.calculate_charge(ph=7, amide=True)
		dict_response.update({"Charge":desc.descriptor[0][0]})
	except:
		dict_response.update({"Charge":"ERR"})
	return dict_response
fasta_file_input = sys.argv[1]
fasta_check, fasta_len= (is_fasta(fasta_file_input))
dict_response_data = {}
if fasta_check:
	dict_response_data.update({"fasta_check":"OK"})
	if fasta_len<=50:
		dict_response_data.update({"fasta_length":"OK"})
		array_responses = []
		#process sequences from fasta file
		for record in SeqIO.parse(fasta_file_input, "fasta"):
			dict_value = {"id_sequence":record.id}
			try:
				dict_value.update({"process_status":"OK"})
				sequence = [residue for residue in record.seq]
				sequence = ''.join(map(str, sequence))
				#get physicochemical properties
				dict_value.update({"properties":get_physicochemical_properties(sequence)})
			except:
				dict_value.update({"process_status":"ERR"})
			array_responses.append(dict_value)

		dict_response_data.update({"get_physicochemical_properties":array_responses})
	else:
		dict_response_data.update({"fasta_length":"ERR"})
else:
	dict_response_data.update({"fasta_check":"ERR"})
print(json.dumps(dict_response_data))
