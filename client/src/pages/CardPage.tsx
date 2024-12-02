import PageWrapper from "src/components/PageWrapper";  
import './cardpage.css';  
  
const CardPage = () => (  
  <PageWrapper title="CardPage">  
   <div className="user-card">  

    <div className="card-logo">  
      <img src="fitknights_logo.png" alt="Logo" />  
    </div>

    <div className="card-header">  
      <h2>Test</h2>
      <h3>Aura Points: 60</h3>  
    </div>  
  
    <div className="card-image">  
      <img src="https://images.unsplash.com/photo-1458349726531-234ad56ba80f?q=80&w=2362&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User" />  
    </div>  

    <div className="bottom-bar">
    </div>
  
    <div className="card-description">  
      <h4>Rank: "input rank"</h4>
      <h5>Could put the latest completed challenges here.</h5>  
    </div>  
   </div>  
  </PageWrapper>  
);  
  
export default CardPage;
