//const baseURL = 'http://34.229.9.143:3000'; 

//const baseURL = 'http://localhost:3000';

const form = document.getElementById('loginForm');

form.addEventListener('submit', async function(event) {
    try {
        event.preventDefault();

        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        const response = await axios.get(`/user/login/${email}/${password}`);
        alert(response.data.message)
        localStorage.setItem('token',response.data.token)
        window.location.href = '../expense/expense.html';  
    } catch (err) {
        console.log(JSON.stringify(err.response.data.err))
        document.body.innerHTML += `<div style="color:red;">${err.response.data.err} <div>`;
    }
});
document.getElementById('forgotPasswordBtn').addEventListener('click', () => {
    document.getElementById('forgotPasswordForm').style.display = 'block';
});

document.getElementById('sendResetEmailBtn').addEventListener('click', async () => {
    const email = document.getElementById('emailInput').value;

    try {
        const response = await axios.post(`/password/forgotpassword`, { email });
        console.log(response.data)
        alert('Reset email sent successfully!');
        document.getElementById('forgotPasswordForm').style.display = 'none';
        document.getElementById('emailInput').value='';
        
    } catch (error) {
        console.error('Error sending reset email:', error);
        alert('Failed to send reset email. Please try again.');
    }
});
