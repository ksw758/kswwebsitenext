import Header from '@/src/components/Header';
import Main from '@/src/components/Main';
import Processing from '@/src/components/Processing';
import Portfolio from '@/src/components/Portfolio';
import VibeCoding from '@/src/components/VibeCoding';
import Pricing from '@/src/components/Pricing';
import Career from '@/src/components/Career';
import Footer from '@/src/components/Footer';
import Contact from "@components/Contact";

export default function Home() {
    return (
        <>
            <Header/>
            <Main/>
            <Processing/>
            <Portfolio/>
            <VibeCoding/>
            <Pricing/>
            <Career />
            <Contact />
            <Footer/>
        </>
    );
}
