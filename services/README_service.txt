Alignment_service_example.py

Este script es solo un ejemplo de como hacer el alineamiento y como obtener los resultados. Necesita EdLib library la cual se instala mediante pip:

https://pypi.org/project/edlib/

No se encuentra implementado ya que requiere de consultas a la base de datos y de los filtros que se seleccionen por las secuencias. Esto es:

1. Filtrar por tipo, esto es, base de datos de antigeno o de anticuerpo
2. Filtros adicionales:
	Largo
	Propiedades fisicoquímicas
	Umbral

3. Esto debería formar un JSON para procesarlo desde python y procesarlo con las secuencias ingresadas en el archivo Fasta

4. No debe haber más de 1 secuencia en el input, no es necesario que exista una subida de archivo, basta con ingresar una secuencia en formato fasta en el area de texto del formulario

5. Se hace el alineamiento y se muestran los resultados.

######################################

mapping_from_fasta_service.py

Inputs:
string_map = sys.argv[1]#string to search	
fasta_seq = sys.argv[2]#fasta file sequence

Outputs:

print json con la información del string buscado en la secuencia

De manera análoga, esto se puede hacer desde la base de datos de antígenos, como mapeo de epítopes lineales en la secuencia de antígenos, para ello se tiene que considerar los siguientes filtros en las secuencias de la base de datos de antígenos:

1. Largo
2. Propiedades
3. GO, otros.

Las salidas de estos resultados deben reflejar los string buscados e identificados en la secuencia

#########################################

physicochemical_characteristics_service.py

Usa la librería from modlamp

Se instala desde pip
https://modlamp.org/

Como input recibe un archivo fasta con las secuencias y se genera un JSON con las respuestas
Se muestran los errores en caso de que corresponda validando el tipo de documento y el número de secuencias dentro de él.

La idea es que se muestren los resultados de una manera simple, puede ser una tabla resumen con formato descargable.

#############################################

predict_go_values_service.py

Dependencias:

metastudent (Ver documento compartido por Yasna para su instalación)

Inputs:
fasta_in= archivo fasta
path_out= path donde se creará el archivo temp y se cargarán los resultados

Servicio que permite predecir las funciones Gene Ontology para las secuencias ingresadas

Output: print JSON donde de muestran las predicciones.

La idea es mostrar los resultados para cada secuencia en un formato tabla descargable

#############################################

predict_interaction_data_service.py

Inputs:

input_folder = sys.argv[1]
pdb_input = sys.argv[2]

Output: print JSON con los resultados de predicciones

Dependencias: Selenium y compañia

Proceso: Recibe el pdf, aplica el servicio whatif y procesa las estimaciones de puentes de hidrógeno,
recolectando todas las interacciones entre diferentes cadenas.

Se revisa que el pdb ingresado presente diferentes cadenas y se retorna toda la información para poder mostrarla en el PDB y hacer las visualizaciones correspondientes.

La idea es que se muestre la lista de interacciones, y se vayan pinchado y mostrando en el PDB

#############################################

predict_pfam_properties_services.py

Inputs:

fasta_in= sys.argv[1]
path_out = sys.argv[2]

Outputs: print JSON con los resultados de las predicciones

Dependencias: PFam (ver documento enviado por Yasna)

Proceso: recibe las secuencias en formato fasta y estima los dominios para la secuencia en PFam, se genera el JSON respecto con toda la información predicha. 

Al igual que el resto de los servicios, la idea es mostrar una tabla resumen con los resultados generados.

#################################################

predict_structural_properties_services.py

Inputs:

fasta_in= sys.argv[1]
path_out = sys.argv[2]

Outputs: print JSON con los resultados de las predicciones

Dependencias: Script sh con el predictor, (ver documento enviado por Yasna)

Proceso: tomas las secuencias en el archivo y las procesa obteniendo las predicciones estructurales.

Los resultados se deben mostrar de igual forma que los anteriores en un formato tabla

####################################################

statistical_counts_service.py

Inputs:

fasta_in con las secuencias en formato fasta

Outputs = print JSON con las estadisticas por secuencia

Proceso: toma las secuencias y se obtienen sus estadisticas a nivel residuo, y a nivel grupos de residuos

Con los resultados, si son varias secuencias, se podría obtener el promedio por residuo y el promedio por grupo, mostrando un gráfico de barras con desviación estándar

La idea sería mostrar el gráfico promedio y las secuencias con un botón para mostrar el gráfico en cada manera individual.

De manera adicional, se debe permitir descargar los resultados de la tabla en un formato excel, otros.





