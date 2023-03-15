export async function getUserData(){
    await fetch(`${document.URL}pos_data`).then(
        res => {res.json().then( async res =>{
            await res;
            return res;
        });
    }).catch(e => console.error(e));
}