def print_obj(objeto):
    # Imprimir el nombre de la clase
    print(f"Clase: {objeto.__class__.__name__}")
    
    # Obtener y imprimir las propiedades
    propiedades = vars(objeto)
    for atributo, valor in propiedades.items():
        print(f"{atributo}: {valor}")
