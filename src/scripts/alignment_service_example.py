import sys
import json
import edlib
from Bio import SeqIO
def align(idA, seqA, seqB):
	align_result = edlib.align(seqA, seqB, mode = "HW", task = "path")
	view_alignment = edlib.getNiceAlignment(align_result, seqA, seqB)
	dict_aligment = {"input_sequence":view_alignment['query_aligned'], "space_format":view_alignment['matched_aligned'], "compare_sequence": view_alignment['target_aligned'], "id_sequence" : str(idA), 'distance_sequences':str(align_result['editDistance'])}
	return dict_aligment
def readJson(filename):
	with open(filename) as json_file: 
		data = json.load(json_file)
		return data
def toFasta(filename):
	fasta = list(SeqIO.parse(open(filename),'fasta'))
	return any(fasta), fasta, len(fasta)
file_input = sys.argv[1]
database = readJson(sys.argv[2])
dict_responses = {}
length = len(database[0])
is_fasta, fasta, len_fasta = toFasta(file_input)
if(is_fasta):
	dict_responses.update({"isFasta":"OK"})
	if(len_fasta == 1):
		dict_responses.update({"FastaLength": "OK"})
		fasta = fasta[0]
		seq = str(fasta.seq)
		if(len(seq) >=5 and len(seq) <=50):
			dict_responses.update({"length_string_map":"OK"})
			if(length <= 50):
				dict_responses.update({"length_DB":"OK"})
				dict_response_array = []
				for i in database:
					id_sequence = i["id_sequence"]
					sequence = i["Sequence"]
					try:
						dict_response_search = {"id_sequence":id_sequence,"Sequence": sequence }
						dict_response_search.update({"response_search": align(id_sequence, seq, sequence)})
						dict_response_array.append(dict_response_search)
					except:
						dict_response_array.append({"id_sequence":id_sequence, "status_service": "ERR","Sequence": sequence})
				dict_responses.update({"align_service":dict_response_array})
			else:
				dict_responses.update({"length_DB":"OK"})
		else:
			dict_responses.update({"length_string_map":"ERR"})
	else:
		dict_responses.update({"FastaLength": "ERR"})
else:
	dict_responses.update({"isFasta":"ERR"})
print(json.dumps(dict_responses))