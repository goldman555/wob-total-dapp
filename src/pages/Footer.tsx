import Asset from './assets';
import '../scss/Footer.scss';


export default function Footer() {
    return (
        <div className="footer">
            <div className='col f-center rg-2'>
                <img src={Asset.logo_white}></img>
                <div className='row cg-1 f-16'>
                    <span>Copyright</span>
                    <span>@</span>
                    <span>WOBBLEBUG 2022</span>
                </div>
            </div>
            <span className='grey'>Made With BASS</span>
        </div>
    );
}