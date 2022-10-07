import Header from "./Header"
import Asset from './assets';
import Footer from "./Footer";

export default function Lore() {
    return (
        <div className="lore">
            <Header title={'WOBBLEBUG'} />
            <div className="col f-center mt-9 cg-6">
                <img className="mylogo" src={Asset.logo1}></img>
                <div className="row f-center cg-3 mt-4">
                    <span className="line"></span>
                    <span className="f-32">LORE</span>
                    <span className="line"></span>
                </div>
                <div className="col j-start w80 mt-5 rg-2 f-12 l-20">
                    <span>Eons ago in a galaxy across the stars Wobbles survived and thrived on their home planet of MetaBass which lay on the outskirts of the universe.</span>
                    <span>They were a wild and bloodthirsty species, known for their uncontrollable hunger (Wobbles are known to have an appetite that is 100x as strong as the average human) and lavish parties among the aliens of nearby planets.</span>
                    <span>Their primary source of food was alien flesh, and even though they ate their way through hundreds of pounds of flesh every day, MetaBass prime was an old planet, with a thriving ecosystem stocked full of a variety of alien animals and other species to feed their insatiable appetites.</span>
                    <span>The Wobbles were happy. They lived an amazing life in peace for thousands of years, consuming the flesh of the alien animal species that roamed their home planet and throwing the most extravagant parties in their solar system. But as time went on the population of MetaBass Prime grew out of control as it does on any planet, and soon enough they found themselves facing a major problem, one that could potentially be the end of their species: Their food source was becoming depleted faster and faster. They were going to go hungry, and SOON.</span>
                    <span>They needed someone to step up. The Wobble Government searched for solutions for months and months but just couldn’t find a way to feed their people. They were forced to implement rationing on a global scale, or face extinction. Hope seemed all but lost.</span>
                    <span>At the eleventh hour, as things grew dire, a fearless Wobble mad scientist, named Wobblebug, hatched a daring plan. He would set out across the stars to find more food for his people. He had heard rumors of other planets outside of their solar system holding vast amounts of flesh for the Wobbles to consume, and long lost tales of a species called “humans” who were the ultimate food source. He knew he had to take action to save the Wobble species.</span>
                </div>

                <img src={Asset.face_logo} className="mt-5"></img>
                <div className="col j-start w80 mt-5 rg-2 f-12 l-20">
                    <span>Wobblebug couldn’t do it alone. It needed help. Over several months he preached to any Wobbles who would listen and amassed a group of devout followers called MegaWobs who believed in his plan to find an extraterrestrial food source.</span>
                    <span>The plan was set, the ship built, and the group of brave MegaWobs set out on their mission across the stars to find more food.</span>
                    <span>They looked for years and years.</span>
                    <span>Finding small planets with limited alien flesh to feed on, but they were running out of time, and they were getting hungrier. They knew their families back home were starving, and they needed a solution.</span>
                    <span>In their darkest hour, with almost no flesh left to feast on, they made a last-ditch effort to venture to a faraway galaxy. This galaxy was known as the milky way, where legends of the past told of a planet known as “Earth”, which hosted the ultimate food source, “humans.”</span>
                    <span>They spun up a wormhole and headed for the Milky Way. As their ship materialized through the other side, their eyes grew wide as a blue and green planet came into focus. They surveyed the planet with their ultra-high power plasma telescopes and what they found would change the course of their species forever.</span>
                    <span>The tales of the human species were true. They were everywhere, billions of them, and they were multiplying much faster than the Wobbles could have ever imagined.</span>
                    <span>They took their spaceship directly to earth and had their sights set on the biggest gathering of humans they could find, a raging music festival with tens of thousands of people. The MegaWobs landed, filed out of their spaceship, being careful to remain unnoticed, and had just started to feed on a few unsuspecting security guards outback, when they realized they had become full. But they had barely eaten. How could they have become so full so fast?</span>
                </div>

                <img src={Asset.face_logo1} className="mt-5"></img>
                <div className="col j-start w80 mt-5 rg-2 f-12 l-20">
                    <span>That's when Wobblebug noticed the antennas of his group of MegaWobs were lighting up with a furious glow.</span>
                    <span>He also noticed a loud, booming sound reverberating through his ears and a thumping he could feel pulsating through his body.</span>
                    <span>He quickly grabbed a festival-goer who started screaming incoherently about something called a dead mouse, and through a telepathic form of communication asked the human what this strange sound and feeling was.</span>
                    <span>The human replied: “Bro, That's heavy BASS.”</span>
                    <span>A lightbulb went off for Wobblebug and he all but broke down in tears. He had found the answer to their crisis. Wobbles could feed directly on BASS, and bass could be created through something the humans called “music.”</span>
                    <span>Wobblebug went back to his ship with the MegaWobs, their bellies full, and started creating music to test the effects of Bass on the Wobble’s hunger. The tests came back and Wobblebug's eyes grew wide. This new form of sustenance was far superior to flesh as a food source!</span>
                    <span>With his MegaWobs hovering above earth, MegaWob hatched a plan to team up with planet Earth’s best music producers to create the heaviest Bass possible.</span>
                    <span>In 2022 the MegaWobs' worldwide invasion of planet earth and their mission to create and consume as much BASS as possible will begin and they will once again thrive. Get ready for the invasion.</span>
                </div>

                <button className="lore-btn m-8">WOBPAPER</button>
            </div>
            <Footer />
        </div>
    )
}