document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('editForm');
    const successMessage = document.getElementById('successMessage');
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
        document.body.innerHTML = '<h1>שגיאה: קישור לא תקין או חסר.</h1>';
        return;
    }

    // טעינת המידע הקיים של הרב
    try {
        const response = await fetch(`/api/rabbi/${token}`);
        if (!response.ok) throw new Error('Rabbi not found');
        
        const rabbi = await response.json();
        // מילוי הטופס במידע הקיים
        for (const key in rabbi) {
            if (form.elements[key]) {
                form.elements[key].value = rabbi[key];
            }
        }
    } catch (error) {
        document.body.innerHTML = `<h1>שגיאה: לא ניתן לטעון את הפרופיל. הקישור עלול להיות שגוי.</h1>`;
        console.error('Failed to load profile:', error);
    }
    
    // שליחת הטופס
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        successMessage.style.display = 'none';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`/api/rabbi/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                successMessage.style.display = 'block';
                setTimeout(() => { successMessage.style.display = 'none'; }, 5000);
            } else {
                alert('שגיאה בשמירת הנתונים.');
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
            alert('אירעה שגיאת תקשורת.');
        }
    });
});
