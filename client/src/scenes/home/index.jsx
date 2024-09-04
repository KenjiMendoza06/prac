import "./index.scss"

export default function Homepage() {
  return (
    <div className="home-container">
      <form className="login-container">
        <h1>AVIOR</h1>
        <span>LEAVE MANAGEMENT SYSTEM</span>
        <br />
        <input type="text" placeholder="Username" className="input-field"/>
        <input type="text" placeholder="Password" className="input-field"/>
        <button className="login-button">
          LOGIN
        </button>
      </form>
    </div>
  )
}