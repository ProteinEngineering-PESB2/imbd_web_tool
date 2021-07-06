import sys
from Bio import SeqIO
import os
import json
import random

#return dict values git count properties
def get_properties(array_prop, array_seq):
	
	dict_response = {value: array_seq.count(value.split("_")[0]) for value in array_prop}
	return dict_response

#check fasta file
def is_fasta(filename):
    with open(filename, "r") as handle:
        fasta = SeqIO.parse(handle, "fasta")
        num_sequences= list(SeqIO.parse(filename, "fasta"))
        return any(fasta),len(num_sequences) # False when `fasta` is empty, i.e. wasn't a FASTA file

#input files
fasta_in= sys.argv[1]
path_export = sys.argv[2]

#create dir with a random id
random_data = str(random.uniform(0, 1000000)).replace(".", "_")
path_out = "{}{}/".format(path_export, random_data)

command = "mkdir -p {}".format(path_out)
os.system(command)

#arrays definitions
ss3_properties=["H_ss3", "E_ss3", "C_ss3"]
ss8_properties= [ "H_ss8", "G_ss8", "I_ss8", "E_ss8", "B_ss8", "T_ss8", "S_ss8", "L_ss8"]
acc_properties=["B_acc", "M_acc", "E_acc"]
disso_properties= [".", "*"]

#sh dependencies
sh_file_properties = "src/scripts/Predict_Property/Predict_Property.sh"
#check fasta file
fasta_check, fasta_len= (is_fasta(fasta_in))

data_response = {}

if fasta_check:
	data_response.update({"is_fasta":"OK"})
	if fasta_len <= 50:
		data_response.update({"total_sequences":fasta_len})
		data_response.update({"status_length":"OK"})

		array_response = []
		for record in SeqIO.parse(fasta_in, "fasta"):
			dict_response_for_sequence = {}

			if len(record.seq) < 4000 and len(record.seq) > 26:
				dict_response_for_sequence.update({"Id_sequence":record.id})
				dict_response_for_sequence.update({"sequence_process":"OK"})
				try:			
					dict_response_for_sequence.update({"exec_process":"OK"})
					seq=str(record.seq).replace("?","").replace(".", "").replace("*","").replace("-","").replace("X","")
					#export sequence to fasta file
					file_out= open("{}seq_structural.fasta".format(path_out), "w+")
					file_out.write(">"+record.id+"\n"+seq+"\n")
					file_out.close()

					#create command
					command= "{} -i {}seq_structural.fasta -o {}".format(sh_file_properties, path_out, path_out)
					os.system(command)
					
					#process all results
					files=os.listdir(path_out)
					first = next(filter(lambda files: ".all" in files, files), None)
					#lecture file
					file_now=open(path_out+first, "r")
					all_lines=file_now.read().split("\n")
					file_now.close()
					
					#get properties count
					dict_all={"counts_ss3":get_properties(ss3_properties, all_lines[2]), "counts_ss8": get_properties(ss8_properties, all_lines[3]), "counts_acc": get_properties(acc_properties, all_lines[4]), "counts_disorder":get_properties(disso_properties, all_lines[5])}
					
					#get results
					dict_all.update({"ss3_properties":all_lines[2], "diso_properties":all_lines[5], "ss8_properties":all_lines[3], "sac_properties":all_lines[4]})

					#export data	
					dict_response_for_sequence.update({"structural_predict": dict_all})
				except:
					dict_response_for_sequence.update({"Id_sequence":record.id})
					dict_response_for_sequence.update({"sequence_process":"ERR"})
			else:
				dict_response_for_sequence.update({"exec_process":"ERR"})

			array_response.append(dict_response_for_sequence)		
		data_response.update({"response": array_response})
	else:
		data_response.update({"status_length":"ERR"})
else:
	data_response.update({"is_fasta":"OK"})
command = "rm -rf {}".format(path_out)
os.system(command)
print(json.dumps(data_response))