import PageHeading from "./components/general/PageHeading"
import PageSubHeading from "./components/general/PageSubHeading"
import SectionCaption from "./components/general/SectionCaption"
import SectionHeading from "./components/general/SectionHeading"
import TextLabel from "./components/general/TextLabel"

function App() {
  return (
    <>
      <div className="group">
        <PageHeading>Demo site of <span className="accent-color">Rishi Sharma</span></PageHeading>
      </div>
      <div className="groupme">
        <section className="space-y-10">
          <div>
            <PageSubHeading className="mb-4">
              Links
            </PageSubHeading>
            <ul className="space-y-3">
              <li><a href="https://github.com/rishisharma08" target="_blank" rel="noopener noreferrer">GIT</a></li>
              <li><a href="https://www.linkedin.com/in/rishisharma013/" target="_blank" rel="noopener noreferrer">Linked In</a></li>
            </ul>
          </div>
          <div>
            <PageSubHeading className="mb-4">
              Technical Skills
            </PageSubHeading>
            <ul className="space-y-3">
              <li>
                <TextLabel>Frontend:</TextLabel>
                Javscript (Vanilla), React, TypeScript, Material UI, Next.js, Styled Components, jQuery
              </li>
              <li>
                <TextLabel>Backend:</TextLabel>
                Node.js (Express, Fastify), REST APIs, GraphQL, Firebase, Python
              </li>
              <li>
                <TextLabel>Databases:</TextLabel>
                MongoDb, Mysql
              </li>
              <li>
                <TextLabel>Styling:</TextLabel>
                CSS, SCSS, Tailwind
              </li>
              <li>
                <TextLabel>Advertising & Integrations:</TextLabel>
                Google Ads, Prebid.js, Google Ad-Manager Library (Python, PHP), Ad Creative Development
              </li>
              <li>
                <TextLabel>Emerging Tech:</TextLabel>
                AI-powered Tooling, Flux API, ChatGPT API, Can differentiate between slop and code
              </li>
              <li>
                <TextLabel>CMS & Platforms:</TextLabel>
                WordPress, PHP, Kirby CMS
              </li>
              <li>
                <TextLabel>Version Control:</TextLabel>
                Git
              </li>
            </ul>
          </div>
          <div>
            <PageSubHeading className="mb-4">
              Education
            </PageSubHeading>

            <div className="space-y-6">
              <div>
                <SectionHeading>
                  <a href="https://www.newschool.edu/parsons/mfa-design-technology/" target="_blank" rel="noopener noreferrer">Parsons New School of Design</a>
                </SectionHeading>
                <p>
                  Master of Fine Arts in Design and Technology
                </p>
                <SectionCaption>
                  New York · 2007 - 2009
                </SectionCaption>
              </div>

              <div>
                <SectionHeading>
                  Bharati Vidyapeeth College of Engineering
                </SectionHeading>
                <p>
                  Bachelor of Engineering in Information Technology
                </p>
                <SectionCaption>
                  Pune, India · 2002 - 2006
                </SectionCaption>
              </div>
            </div>
          </div>
          <div>
            <PageSubHeading className="mb-4">
              Spoken Languages
            </PageSubHeading>
            <ul className="flex gap-4">
              <li>English</li>
              <li>Hindi</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  )
}

export default App
