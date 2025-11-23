// apps/site/app/our-team/page.tsx
import '@styles/team.css'

type TeamMember = {
  name: string;
  title: string;
  location?: string;
  bio: string[];
  imageUrl?: string; // optional → supports "no photo"
};

const teamMembers: TeamMember[] = [
  {
    name: 'Edward Cox',
    title: 'Founding Partner',
    bio: [
        "Ed formerly served as a Senior Policy Advisor in the United States Senate, and later as a government-affairs professional in the private sector, with a focus and expertise in geospatial, infrastructure, energy, natural resources, environmental, and agricultural policy.",
        "Prior to his time on Capitol Hill, Ed served as the campaign director for Senator Orrin G. Hatch. After helping re-elect the senator in 2012, he joined the legislative staff in Washington, D.C., as a senior policy advisor. During his time in the Senate, he wrote and helped pass several legislative priorities, including a large-scale federal land and mineral exchange of over 100,000 acres in the State of Utah. Additionally, on behalf of Senator Hatch, Ed organized a bipartisan team and worked with a wide range of relevant stakeholders to draft the Geospatial Data Act, which was signed into law in 2018.",
        "Ed has also previously worked as a political consultant and managed the campaigns of various candidates at the municipal and state level, as well as a member of Congressman Chris Cannon's re-election campaign. With extensive experience working with various departments and agencies of both Democratic and Republican Administrations, Ed values his ability to identify stakeholder needs while also pursuing a comprehensive policy agenda",
        "A graduate of the University of Utah, Ed holds a B.S. in Economics. He served as the State Chairman for Utah's Federation of College Republicans and later as the College Republican National Committee's Regional Political Director. Ed is an Eagle Scout and practiced as a small-engine mechanic, having worked for his family's small business. Originally from St. George, Utah, and after living in Washington, D.C. for a decade, he now resides in Denver, Colorado with his wife Karen, daughter Emery, and sons Everett and Ellis.",
    ],
    imageUrl: '/team/edwardcox.jpg', // update to your real path
  },
  {
    name: 'Romel Nicholas',
    title: 'Managing Partner',
    imageUrl: '/team/romelnicholas.jpg',
    bio: [
      "Romel possesses expertise in energy, natural resources, environmental, GIS/geospatial, agriculture, and transportation policy. Prior to founding his own practice, he served as a senior policy advisor to two U.S. Senators on matters under the jurisdiction of the Commerce, Energy & Natural Resources, and Environment & Public Works Committees, among others. Romel first served under Senator Orrin Hatch (R-UT) from 2014 until his retirement and subsequently worked for his home-state senator, Senator Pat Toomey (R-PA), in a similar role. He served as Chair of the Senate GIS Working Group during his time with both senators.",
      "Over the course of his time in the Senate, Romel conducted drafting, guided introduction, and/or oversaw the passage of over 21 pieces of original legislation (7 bills/provisions passed into law); most notably, he helped author, negotiate, and pass into law two major pieces of legislation that enjoyed robust bipartisan support: The Geospatial Data Act (GDA) and the Emery County Public Lands Act (ECPLA).",
      "Romel graduated from the University of Notre Dame with a degree in Program of Liberal Studies. Outside of work, he draws and paints amateur hand-made cartography, is an avid baseball (and fantasy baseball) fan, and volunteers for the National Flag Foundation on veterans affairs projects. Originally from Pittsburgh, he now resides in Washington, DC, where he has lived since 2014.",
    ]
  },
  {
    name: 'Lonald Wishom',
    title: 'Director, Business Development',
    // no imageUrl → tests “no photo” state
    imageUrl: '/team/lonaldwishom.png',
    bio: [
      "Lonald Wishom, with his extensive experience as a staff member in the United States Senate, Customer Success Manager at Salesforce, now significantly contributes as the Director of Business Development at ERA Government Affairs.",
      "During his time in the Senate, Lonald deepened his understanding of the governmental landscape, laying a solid foundation for his subsequent endeavors. Transitioning to the technology sector, he employed his skills at Salesforce as a Customer Success Manager. In this role, he adeptly managed the Strategic Banking Portfolio, honing his capacity for maintaining and nurturing high-value customer relationships.",
      "Now, at ERA Government Affairs, Lonald skillfully guides the business development efforts. Drawing on his extensive knowledge and experience from both government and business sectors, he excels in building and maintaining client relationships, focusing particularly on client development.",
      "A proud alumnus of Weber State University with a B.S. in Political Science and Government, Lonald went on to acquire an MBA from Columbia Business School. He maintains ties with Columbia as the Co-Chair of the Young Alumni Board, reflecting his commitment to fostering community connections. Originating from Antioch, California, Lonald's diverse experiences uniquely equip him for continued success in his current role."
    ]
  },
  {
    name: 'Danny Scales',
    title: 'Director, Legislative Research',
    // no imageUrl → tests “no photo” state
    bio: [],
  },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function OurTeamPage() {
  return (
    <main>
      <section className="c-section c-section--team">
        <div className="c-container">
          <header className="team-header">
            <h1 className="type-h1">Our Team</h1>
            {/* <p className="type-body"> */}
              {/* TO DO: add positioning copy? */}
              {/* ERA Government Affairs is led by a team of experienced
              advocates and advisors with deep expertise in federal policy,
              congressional process, and public affairs.
            </p> */}
          </header>

          <div className="team-grid">
            {teamMembers.map((member) => (
              <article key={member.name} className="team-card">
                {member.imageUrl && (
                  <div className="team-card__photo">
                    <img src={member.imageUrl} alt={member.name} />
                  </div>
                )}
                {/* <div className="team-card__photo">
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} />
                  ) : (
                    <div className="team-card__placeholder">
                      <span>{getInitials(member.name)}</span>
                    </div>
                  )}
                </div> */}

                <div className="team-card__body">
                  <h2 className="type-h3">{member.name}</h2>
                  <p className="type-small team-card__title">
                    {member.title}
                  </p>
                  {member.location && (
                    <p className="type-small team-card__location">
                      {member.location}
                    </p>
                  )}
                  {member.bio.map((para, idx) => (
                    <p key={idx} className="type-body team-card__bio">
                      {para}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
