import json
from selenium import webdriver
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys
import tqdm
import time
import os
import argparse
import sh
import requests
import multiprocessing
import numpy as np
import pandas as pd
from Bio.PDB.PDBParser import PDBParser
import sys

#get results from whatif using pdb input got
def scrapping(pdb_file, input_folder):

    op = webdriver.ChromeOptions()
    op.add_argument('headless')#Para no ver la ventana del navegador (recomendado)
    
    #create browser driver
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=op)
    if pdb_file != '':
        try:
            response = "Traceback"            
            while("Traceback" in response):#Esto es para evitar errores (de whatif)
                driver.get("https://swift.cmbi.umcn.nl/servers/html/hnet.html")
                form = driver.find_elements_by_tag_name("input")[2]
                form.send_keys(os.getcwd()+"/"+input_folder+ pdb_file)
                driver.find_elements_by_tag_name("input")[3].click()
                response = "Processing .."
                while(response == "Processing .."):
                    response = driver.find_element_by_tag_name("body").text
                    time.sleep(0.5)
            route = "{}/{}{}".format(os.getcwd(), input_folder, pdb_file.replace(".pdb", ".txt"))
            f = open(route, "w")
            f.write(response)
            f.close()
        except:
            pass
    driver.close()

#check number of chain 
def check_number_chains(input_folder, pdb_file):

    parser = PDBParser()#creamos un parse de pdb
    pdb_code = pdb_file.split("/")[-1].split(".")[0]
    structure = parser.get_structure(pdb_code, input_folder+pdb_file)

    chains = 0
    for model in structure:
        for chain in model:
            chains+=1

    if chains>=2:
        return True
    else:
        return False

#check file output
def check_whatif_result(input_folder):

    list_files = os.listdir(input_folder)

    file_exist = False

    for file in list_files:
        if ".txt" in file:
            file_exist = True
            break

    return file_exist

def get_edges_from_line(line_hbond_file):

    data_validation = line_hbond_file.split(" ")
    data_validation = [value for value in data_validation if str(value) != "nan" and value!= "" and value != ")" and value != "("]

    response = []

    if "you" not in line_hbond_file:
        try:
            if len(data_validation) == 15:
                node1 = "{}-{}-{}".format(data_validation[3][1].replace("(", ""), data_validation[1].replace("(", ""), data_validation[2].replace("(", ""))
                node2 = "{}-{}-{}".format(data_validation[9][1].replace("(", ""), data_validation[7].replace("(", ""), data_validation[8].replace("(", ""))
                value_interaction = data_validation[-1]

                response = [node1, node2, value_interaction]

        except:
            pass

        try:
            if len(data_validation) == 16:
                
                node1 = "{}-{}-{}".format(data_validation[3][1].replace("(", ""), data_validation[1].replace("(", ""), data_validation[2].replace("(", ""))
                node2 = "{}-{}-{}".format(data_validation[9][1].replace("(", ""), data_validation[7].replace("(", ""), data_validation[8].replace("(", ""))
                value_interaction = data_validation[-2]

                response = [node1, node2, value_interaction]
        except:
            pass

        try:
            if len(data_validation) == 17:

                res_1 = data_validation[1]
                res_2 = data_validation[6]
                pos_chain1 = data_validation[2].split(")")
                pos_chain2 = data_validation[7].split(")")
                value_interaction = data_validation[12]

                node1= "{}-{}-{}".format(pos_chain1[1].replace("(", ""), res_1.replace("(", ""), pos_chain1[0].replace("(", ""))
                node2= "{}-{}-{}".format(pos_chain2[1].replace("(", ""), res_2.replace("(", ""), pos_chain2[0].replace("(", ""))

                response = [node1, node2, value_interaction]

        except:
            pass

        try:
            if len(data_validation) == 18:
                
                #process node 1
                res1 = data_validation[1]
                pos1 = ""
                chain1 = ""

                res2 = ""
                pos2 = ""
                chain2 = ""

                if len(data_validation[2].split(")"))>1:
                    pos1 = data_validation[2].split(")")[0]
                    chain1 = data_validation[2].split(")")[1]
                    res2 = data_validation[6]

                    pos2 = data_validation[7]
                    chain2 = data_validation[8][1]

                else:
                    pos1 = data_validation[2]
                    chain1 = data_validation[3][1]
                    res2 = data_validation[7]
                    pos2 = data_validation[8].split(")")[0]
                    chain2 = data_validation[8].split(")")[1]

                node1 = "{}-{}-{}".format(chain1.replace("(", ""), res1.replace("(", ""), pos1.replace("(", ""))
                node2 = "{}-{}-{}".format(chain2.replace("(", ""), res2.replace("(", ""), pos2.replace("(", ""))

                value_interaction = data_validation[13]

                response = [node1, node2, value_interaction]
        
        except:
            pass

        try:
            if len(data_validation) == 19:

                node1 = "{}-{}-{}".format(data_validation[3][1].replace("(", ""), data_validation[1].replace("(", ""), data_validation[2].replace("(", ""))
                node2 = "{}-{}-{}".format(data_validation[9][1].replace("(", ""), data_validation[7].replace("(", ""), data_validation[8].replace("(", ""))
                value_interaction = data_validation[14]

                response = [node1, node2, value_interaction]

        except:
            pass

        try:
            if len(data_validation) == 20:
                node1 = "{}-{}-{}".format(data_validation[3][1].replace("(", ""), data_validation[1].replace("(", ""), data_validation[2].replace("(", ""))
                node2 = "{}-{}-{}".format(data_validation[10][1].replace("(", ""), data_validation[8].replace("(", ""), data_validation[9].replace("(", ""))
                value_interaction = data_validation[15]

                response = [node1, node2, value_interaction]

        except:
            pass

        try:
            if len(data_validation) == 21:
                node1 = "{}-{}-{}".format(data_validation[3][1].replace("(", ""), data_validation[1].replace("(", ""), data_validation[2].replace("(", ""))
                node2 = "{}-{}-{}".format(data_validation[10][1].replace("(", ""), data_validation[8].replace("(", ""), data_validation[9].replace("(", ""))
                value_interaction = data_validation[16]

                response = [node1, node2, value_interaction]

        except:
            pass

    return response


#process result whatif
def process_result_whatif(input_folder, pdb_file):

    name_file = input_folder+pdb_file.replace("pdb", "txt")
    file_open = open(name_file, 'r')

    #jump the first four lines
    line = file_open.readline()
    line = file_open.readline()
    line = file_open.readline()
    line = file_open.readline()

    array_interactions = []
    while line:
        line = line.replace("\n", "")       
        if "Flipped" in line:
            break
        else:
            response = get_edges_from_line(line)            
            if len(response) == 3:
                if response[0][0] != response[1][0]:

                    interaction = {"chain_1":response[0].split("-")[0], "residue_1":response[0].split("-")[1], "pos_1":response[0].split("-")[2], "chain_2":response[1].split("-")[0], "residue_2":response[1].split("-")[1], "pos_2":response[1].split("-")[2], "value_interaction":response[2]}
                    array_interactions.append(interaction)                    
        line = file_open.readline()
    file_open.close()

    return array_interactions

#arguments
input_folder = sys.argv[1]
pdb_input = sys.argv[2]

dict_response = {}

#check number of chains
if check_number_chains(input_folder, pdb_input):
    dict_response.update({"number_chains": "OK"})

    #process scraping
    #scrapping(pdb_input, input_folder)

    if check_whatif_result(input_folder):
        dict_response.update({"status_whatif": "OK"})
        array_interactions = process_result_whatif(input_folder, pdb_input)

        dict_response.update({"detected_interactions":array_interactions})
        
    else:
        dict_response.update({"status_whatif": "ERR"})
else:
    dict_response.update({"number_chains": "ERR"})

print(json.dumps(dict_response))
