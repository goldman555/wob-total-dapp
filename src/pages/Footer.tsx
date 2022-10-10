import Asset from './assets';
import '../scss/Footer.scss';


export default function Footer() {
    return (
        <div className="footer">
            <div className='row cg-1 f-16'>
                <img className='logo' src={Asset.logo_white}></img>
                <span>WOBBLEBUG @ 2022</span>
            </div>
            <div className="region">
                <div className="row cg-1">
                    <img src={Asset.twitter}></img>
                    <img src={Asset.instagram}></img>
                    <img src={Asset.discord}></img>
                </div>
                <span className='grey'>Made With BASS</span>
            </div>
        </div>
    );
}