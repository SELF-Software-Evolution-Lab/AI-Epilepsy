import "dotenv/config"
import {config} from "@config/env";
import * as ftp from "basic-ftp"
import * as process from "process";

const seedFTP = async () => {
    const relative = '/seed_data/'
    const path1 = `${process.cwd()}${relative}/exams-dev/`
    const path2 = `${process.cwd()}${relative}/examsToAssociate/`

    const client = new ftp.Client()
    client.ftp.verbose = true
    const {host, user, password} = config.ftp.connections[0]
    try {
        await client.access({
            host: host,
            user: user,
            password: password,
            secure: false
        })
        console.log(await client.list())
        await client.ensureDir("/home/user/exams-dev/")
        await client.clearWorkingDir()
        await client.uploadFromDir(path1)
        await client.ensureDir("/home/user/examsToAssociate/")
        await client.clearWorkingDir()
        await client.uploadFromDir(path2)
    }catch (e) {
        console.error("An error occurred while seeding the FTP server with example MRI images")
        console.error(e)
    }

}

seedFTP().then(()=>{
    console.log("Successfully seeded FTP!")
    process.exit(0)
}).catch(()=>{
    console.error("An unexpected error occurred while seeding the FTP server. Try again")
    process.exit(1)
})
