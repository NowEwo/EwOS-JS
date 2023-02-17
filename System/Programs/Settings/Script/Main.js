function Fetch(URL) {
    http = new XMLHttpRequest();
    http.open("GET", URL, false);
    http.send();
    return http.responseText;
}

function BooleanYesNo(Boolean){
    if(Boolean == true){
        return "Yes";
    }else if(Boolean == false){
        return "No";
    }
}

Config = JSON.parse(Fetch("/api"));

for(ElementObject in document.getElementsByTagName("JS")){
    document.getElementsByTagName("JS")[ElementObject].innerHTML = eval(document.getElementsByTagName("JS")[ElementObject].innerHTML);
}

function Tab(Name) {
    document.querySelector("#Content").innerHTML = document.getElementById(Name).innerHTML
}

for(Partition in localStorage){
    if(Partition.slice(0 , 11) == "FileSystem_"){
        var PartitionName = Partition.replace("FileSystem_" , "");
        var Partition = document.createElement("p");
        Partition.innerHTML = PartitionName;
        document.getElementById("DiskPartitions").appendChild(Partition);
    }
}