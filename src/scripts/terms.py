from pymongo import MongoClient
con = MongoClient('localhost',27017)
db = con.IMDb
cols = ["Antibody", "Antigen"]
rols = ["Cellular_component", "Molecular_function", "Biological_process", "Pfam"]
terms = []
for i in cols:
    for j in rols:
        results = list(db.go_pfam.find({"Colection": i},{j: 1, "_id":0}))[0][j]
        for k in results:
            k.pop("id")
            k.update({"rol": j})
            k.update({"Colection": i})
            terms.append(k)
db.Terms.insert_many(terms)
