var Registery = new FFS("Registery");

Registery.SetKey = (Path , Value) => {
    Registery.writeFile(Path , JSON.stringify({
        "Name" : Registery.basename(Path),
        "Path" : Path,
        "Value" : Value
    }));
}

Registery.GetKey = (Path) => {
    return JSON.parse(Registery.getFileContent(Path).result).Value;
}