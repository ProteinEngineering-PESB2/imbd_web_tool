from pymongo import MongoClient
con = MongoClient('localhost',27017)
db = con.IMDb
""" cols = ["Antibody", "Antigen"]
#Cellular_component", "Molecular_function", "Biological_process", "Pfam", 
db.Terms.delete_many({"rol": "interaction"})

terms = []
for i in cols:
    results = list(db.go_pfam.find({"Colection": i}, {"interactions": 1, "_id": 0}))[0]["interactions"]
    for j in results:
        row = {}
        row.update({"rol": "relation", "Colection": i, "text": j})
        terms.append(row)
print(terms)
db.Terms.insert_many(terms) """
db.Terms.delete_many({"rol": "relation"})
terms = []
results = list(db.go_pfam.find({"Colection": "Epitope"},{"antigens": 1, "_id": 0}))[0]["antigens"]
for j in results:
    row = {}
    row.update({"rol": "relation", "Colection": "Epitope", "text": j})
    terms.append(row)
print(terms)
db.Terms.insert_many(terms)
exit()
""" rols = ["pdb"]
db.Terms.delete_many({"rol": "pdb"})
terms = []
for i in cols:
    results = list(db.go_pfam.find({"Colection": i},{"pdb": 1, "_id":0}))[0]["pdb"]
    for j in results:
        row = {}
        row.update({"rol": "pdb", "Colection": i, "text": j})
        terms.append(row)
print(terms) """
""" for i in cols:
    for j in rols:
        results = list(db.go_pfam.find({"Colection": i},{j: 1, "_id":0}))[0][j]
        print(results)
        exit()
        for k in results:
            k.pop("id")
            k.update({"rol": j})
            k.update({"Colection": i})
            terms.append(k)
db.Terms.insert_many(terms) """
