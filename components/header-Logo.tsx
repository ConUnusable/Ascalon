import Link from 'next/link';
import Image from 'next/image';

export const HeaderLogo = () => {
    return (
        <div className="flex items-center">
            <Link href="/">
                <div className="items-center lg:flex">
                    <Image src="/Ascalon vector.svg" alt="Ascalon" height={40} width={40} />
                    <p className="hidden lg:flex font-bold font-montserrat text-white text-3xl ml-2.5">
                        Ascalon    
                    </p>
                </div>
            </Link>
        </div>
    );
};

