
const baseURL = 'http://localhost:3000/user'; 

const form = document.getElementById('signupForm');

form.addEventListener('submit', async function(event) {
    try {
        event.preventDefault(); 
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        const response = await axios.post(`${baseURL}/signup`, data);
        if(response.status === 201){
            alert(response.data.message)
            window.location.href = "../Login/login.html";
        } else {
            throw new Error('Failed to login')
        }
    } catch (error) {
        document.body.innerHTML += `<div style="color:red;">${error.response.data.err} <div>`;
            //dynamically adds a new <div> element to the end of the <body>
    }
})