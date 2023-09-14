import Image from 'next/image';
import Link from 'next/link';
import { Orbitron } from 'next/font/google';

//  components
import Logo from '.././../public/GlobalNewsLogo.png';

const orbitron = Orbitron({
    subsets: ['latin'],
    weight: ['400', '700', '900']
});

const Header = () => {
    return (
        <div className={ `${orbitron.className} header`}>
            <Image src={Logo} alt='Global News Logo' />
            <h2>Open Global News</h2>
        </div>
    );
};

export default Header;
