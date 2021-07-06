from Bio.PDB.PDBParser import PDBParser
import sys
def ThreeToOne(aminoacid):
    transform = {
        "ALA": "A",
        "ARG": "R",
        "ASN": "N",
        "ASP": "D",
        "CYS": "C",
        "GLN": "Q",
        "GLU": "E",
        "GLY": "G",
        "HIS": "H",
        "ILE": "I",
        "LEU": "L",
        "LYS": "K",
        "MET": "M",
        "PHE": "F",
        "PRO": "P",
        "SER": "S",
        "THR": "T",
        "TRP": "W",
        "TYR": "Y",
        "VAL": "V"
    }
    return transform[aminoacid]
aminoacidos = ["ALA","ARG","ASN","ASP","CYS",
               "GLN","GLU","GLY","HIS","ILE",
               "LEU","LYS","MET","PHE","PRO",
               "SER","THR","TRP","TYR","VAL"]
name = sys.argv[1]
parser = PDBParser()
structure = parser.get_structure(name, "src/public/Structures/"+ name +".pdb")
data = []
for model in structure:
    for ic, chain in enumerate(model):
        obj = {}
        obj["chain"]= chain.id
        obj["sequence"] = ""
        for residue in chain:
            resname = residue.resname
            if(resname in aminoacidos):
                obj["sequence"]+=ThreeToOne(resname)
        data.append(obj)
print(str(data).replace("'", '"'))