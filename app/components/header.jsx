import Image from 'next/image';
import Link from 'next/link';
import { Orbitron } from 'next/font/google';
import { Rajdhani } from 'next/font/google';

//  components
import Logo from '.././../public/GlobalNewsLogo.png';

const orbitron = Orbitron({
    subsets: ['latin'],
    weight: ['400', '700', '900']
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '700']
});

const Header = () => {
    return (
        <div className={ `${orbitron.className} header`}>
            <div className="logo">
                <Image src={Logo} alt='Global News Logo' />
                <h2>Open Global News</h2>
            </div>
            <p className={rajdhani.className}>This is a development site
            <span>, designed to process the building of an open and free global news resource.</span>
            </p>
        </div>
    );
};

export default Header;
