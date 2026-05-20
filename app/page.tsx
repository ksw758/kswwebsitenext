import Header from '@/src/components/Header';
import Main from '@/src/components/Main';
import Processing from '@/src/components/Processing';
import Portfolio from '@/src/components/Portfolio';
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
            <Career />
            <Contact />
            <Footer/>
        </>
    );
}
