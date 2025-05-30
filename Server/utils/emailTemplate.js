export function generateVerifiactionOtpEmailTemplate(otpCode){
    return `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(to right, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; color: #fff;">

    <div style="background: white; color: #333; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); max-width: 400px; width: 100%; text-align: center;">
      
      <h2 style="margin-bottom: 1rem; font-size: 1.8rem; color: #4c51bf;">Verify Your Identity</h2>
      
      <p style="font-size: 1rem; margin-bottom: 1.5rem;">Please use the OTP below to complete your verification.</p>
      
      <div style="font-size: 2rem; letter-spacing: 8px; background: #edf2f7; padding: 0.8rem; border-radius: 8px; display: inline-block; margin-bottom: 2rem; font-weight: bold; color: #2d3748;">
        ${otpCode}
      </div>
      
      <br />
      
      <button style="padding: 0.7rem 1.5rem; font-size: 1rem; background-color: #4c51bf; color: white; border: none; border-radius: 6px; cursor: pointer; transition: background 0.3s ease;">
        Verify OTP
      </button>
      
      <div style="margin-top: 1.5rem; font-size: 0.85rem; color: #888;">
        This code is valid for 15 minutes.
      </div>
    </div>

    <div style="margin-top: 2rem; font-size: 1rem; color: #f0f0f0; text-align: center;">
      Thank you,<br/>
      <strong>BookWorm</strong>
    </div>

  </div>`
}