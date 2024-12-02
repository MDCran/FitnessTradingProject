import PageWrapper from "src/components/PageWrapper";  
import './cardpage.css';  
  
const CardPage = () => (  
  <PageWrapper title="CardPage">  
   <div className="user-card">  
    <div className="card-header">  
      <h2>Test</h2>
      <h3>Aura Points: 60</h3>  
    </div>  
  
    <div className="card-image">  
      <img src="user.png" alt="User" />  
    </div>  
  
    <div className="card-description">  
      <h3>Rank: "input rank"</h3>
      <h4>Could put the latest completed challenges here.</h4>  
    </div>  
   </div>  
  </PageWrapper>  
);  
  
export default CardPage;
