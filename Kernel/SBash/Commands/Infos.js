Terminal.echo(`
AODOS !
Version : ${Kernel.Fetch("Version.conf")}
User name : ${Kernel.User["Name"]}
Super user : ${JSON.parse(Kernel.Fetch("/api"))["SuperUser"]}
Mounted partition : ${Shell.FileSystem.Partition}
`);