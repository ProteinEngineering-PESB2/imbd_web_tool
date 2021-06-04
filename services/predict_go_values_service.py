import sys
from Bio import SeqIO
import os
import json
import subprocess
import random

def is_fasta(filename):
    with open(filename, "r") as handle:
        fasta = SeqIO.parse(handle, "fasta")
        num_sequences= list(SeqIO.parse(filename, "fasta"))
        return any(fasta),len(num_sequences) # False when `fasta` is empty, i.e. wasn't a FASTA file

def get_values_GO(path_data, filename, dictionary, go_type, go_abb):
	file_now=open("{}{}".format(path_data, filename), "r")
	all_lines=file_now.read().split("\n")
	
	if len(all_lines) > 1:
		first_result= all_lines[0].split("\t")
		dictionary[go_type+"_GO"]= first_result[1]
		dictionary["Predict_value_"+go_abb]= first_result[2]
	else:
		dictionary[go_type+"_GO"]= "Not results"
		dictionary["Predict_value_"+go_abb]= "-"
	return dictionary

fasta_in= sys.argv[1]
path_out= sys.argv[2]

#create dir with a random id
random_data = str(random.uniform(0, 1000000)).replace(".", "_")
path_out = "{}{}/".format(path_out, random_data)

command = "mkdir -p {}".format(path_out)
os.system(command)

fasta_check, fasta_len= (is_fasta(fasta_in))

data_response = {}

if fasta_check:

	data_response.update({"is_fasta":"OK"})

	if fasta_len <= 50:
		data_response.update({"lenght_sequence":"OK"})
		
		array_response = []

		for record in SeqIO.parse(fasta_in, "fasta"):
			dict_predict_go = {"fasta_sequence":record.id}
			try:
				dict_predict_go.update({"exec_prediction":"OK"})

				seq=str(record.seq).replace("?","").replace(".", "").replace("*","").replace("-","").replace("X","")
				file_out= open("{}seq_GO.fasta".format(path_out), "w+")
				file_out.write(">"+record.id+"\n"+seq+"\n")
				file_out.close()
				command= "metastudent -i {}seq_GO.fasta -o {}seq_GO_".format(path_out, path_out)
				salida=subprocess.check_output(command, stderr=subprocess.STDOUT, shell=True)
				files=os.listdir(path_out)
				files = [value for value in files if "seq_GO.fasta" not in value]

				dict_all={}
				get_values_GO(path_out, files[0], dict_all, "Biological_Process", "BPO")
				get_values_GO(path_out, files[1], dict_all, "Celular_Component", "CCO")
				get_values_GO(path_out, files[2], dict_all, "Molecular_Function", "MFO")
				
				dict_predict_go.update({"go_predictions":dict_all})				
			except:
				dict_predict_go.update({"exec_prediction":"ERR"})

			array_response.append(dict_predict_go)
		data_response.update({"go_data":array_response})

	else:
		data_response.update({"lenght_sequence":"ERR"})
else:
	data_response.update({"is_fasta":"ERR"})

print(json.dumps(data_response))
command = "rm -rf {}".format(path_out)
os.system(command)