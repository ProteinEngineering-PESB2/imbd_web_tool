import sys
import subprocess
import time
import os
import json
from Bio import SeqIO
import random

def is_fasta(filename):
    with open(filename, "r") as handle:
        fasta = SeqIO.parse(handle, "fasta")
        num_sequences= list(SeqIO.parse(filename, "fasta"))
        return any(fasta),len(num_sequences) # False when `fasta` is empty, i.e. wasn't a FASTA file

#input values
fasta_in= sys.argv[1]
path_out = sys.argv[2]

#create dir with a random id
random_data = str(random.uniform(0, 1000000)).replace(".", "_")
path_out = "{}{}/".format(path_out, random_data)

command = "mkdir -p {}".format(path_out)
os.system(command)

fasta_check, fasta_len= (is_fasta(fasta_in))

dict_response = {}

if fasta_check:
	dict_response.update({"fasta_check":"OK"})

	if fasta_len<=50:
		dict_response.update({"fasta_len":"OK"})

		array_values_fasta = []

		for record in SeqIO.parse(fasta_in, "fasta"):
			dict_response_sequence={"id_sequence":record.id}			
			
			if len(list(record.seq)) > 10 and len(list(record.seq)) < 10000:
				dict_response_sequence.update({"length_sequence":"OK"})
				try:					
					dict_response_sequence.update({"status_process":"OK"})
					
					seq=str(record.seq).replace("?","").replace(".", "").replace("*","").replace("-","").replace("X","")
					file_out= open("{}seq_Pfam.fasta".format(path_out), "w+")
					file_out.write(">"+record.id+"\n"+seq+"\n")
					file_out.close()

					command= "curl -LH 'Expect:' -F seq='<{}seq_Pfam.fasta' -F output=xml 'https://pfam.xfam.org/search/sequence'".format(path_out)					
					salida=subprocess.check_output(command, stderr=subprocess.STDOUT, shell=True)
					
					link_search=str(salida).split("result_url")
					
					array_pfam_responses = []

					if len(link_search) > 1:
						link_result=link_search[1].replace(">","").replace("<","")
						link_result=link_result[:-1]
						link_completo= "https://pfam.xfam.org"+link_result
						#print(link_completo)
						time.sleep(30)
						command2= "curl -s -LH 'Expect:' '"+link_completo+"'"
						result = os.popen(command2).read()
						file_pfam= open("pfam_result.xml", "w")
						file_pfam.write(result)
						file_pfam.close()
						file_pfam_in= open("pfam_result.xml", "r")
						all_lines=file_pfam_in.read().split("\n")
																					
						if '    <matches>' in all_lines:
							for n in range(len(all_lines)):
								if "match accession" in all_lines[n]:
									dic_response_pfma = {"Accession": "", "Id_accession":"", "Type": "", "Class":"", "Evalue":"", "Bitscore":""}
									#row_out=[dataset_in["Id_sequence"][i]]
									linea1= all_lines[n].replace("          ","").replace(">","").replace("<","").split(" ")
									linea2= all_lines[n+1].replace("            ","").replace(">","").replace("<","").split(" ")
									dic_response_pfma["Accession"]=(linea1[1].replace('"',"").split("=")[1])
									dic_response_pfma["Id_accession"]=(linea1[2].replace('"',"").split("=")[1])
									dic_response_pfma["Type"]=(linea1[3].replace('"',"").split("=")[1])
									dic_response_pfma["Class"]=(linea1[4].replace('"',"").split("=")[1])
									dic_response_pfma["Evalue"]=(linea2[7].replace('"',"").split("=")[1])
									dic_response_pfma["Bitscore"]=(linea2[8].replace('"',"").split("=")[1])
									array_pfam_responses.append(dic_response_pfma)
							dict_response_sequence.update({"pfam_predicts":array_pfam_responses})
						else:
							dict_response_sequence.update({"pfam_predicts":array_pfam_responses})
							
					else:
						dict_response_sequence.update({"pfam_predicts":array_pfam_responses})
				except:
					dict_response_sequence.update({"status_process":"ERR"})	
			else:
				dict_response_sequence.update({"length_sequence":"ERR"})
				
			array_values_fasta.append(dict_response_sequence)

		dict_response.update({"pfam_predicts_response":array_values_fasta})
	else:
		dict_response.update({"fasta_len":"ERR"})
else:
	dict_response.update({"fasta_check":"ERR"})	

print(json.dumps(dict_response))
command = "rm -rf {}".format(path_out)
os.system(command)