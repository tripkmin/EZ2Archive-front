import ReCAPTCHA from 'react-google-recaptcha'

function onChange(value) {
  console.log('Captcha value:', value)
}

ReactDOM.render(
  <ReCAPTCHA sitekey="Your client site key" onChange={onChange} />,
  document.body
)
