
//const baseURL = 'http://34.229.9.143:3000'; 

//const baseURL = 'http://localhost:3000';

const form = document.getElementById('signupForm');

form.addEventListener('submit', async function(event) {
    try {
        event.preventDefault(); 
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        console.log(data)
        const response = await axios.post(`/user/signup`, data);
        if(response.status === 201){
            alert(response.data.message)
            window.location.href = "../Login/login.html";
        } else {
            throw new Error('Failed to login')
        }
    } catch (error) {
        console.log(error.response.data.err)
        document.body.innerHTML += `<div style="color:red;">${error} <div>`;
            //dynamically adds a new <div> element to the end of the <body>
    }
})