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

const Footer = () => {
    return (
        <div className={ `${orbitron.className} footer`}>
            <div className="logo">
                <Image src={Logo} alt='Global News Logo' />
            </div>
            <div className={rajdhani.className}>
                <p>Contact: </p>
                <p>
                    <a href="mailto: info@littlewisemonkey.com">
                        Little Wise Monkey
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Footer;
