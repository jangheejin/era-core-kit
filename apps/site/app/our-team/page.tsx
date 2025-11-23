// apps/site/app/our-team/page.tsx
import '@styles/team.css'

type TeamMember = {
  name: string;
  title: string;
  location?: string;
  bio: string;
  imageUrl?: string; // optional → supports "no photo"
};

const teamMembers: TeamMember[] = [
  {
    name: 'Person One',
    title: 'Founding Partner',
    location: 'Washington, D.C.',
    imageUrl: '/img/lonald-wishom.png', // update to your actual filename
    bio: 'Replace this with Person One’s full bio text.',
  },
  {
    name: 'Person Two',
    title: 'Managing Partner',
    location: 'Washington, D.C.',
    imageUrl: '/img/edward-cox.png',
    bio: 'Replace this with Person Two’s full bio text.',
  },
  {
    name: 'Person Three',
    title: 'Senior Advisor',
    location: 'Washington, D.C.',
    // imageUrl intentionally omitted to test "no photo" state
    bio: 'Replace this with Person Three’s full bio text.',
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
            <p className="type-body">
              Short positioning sentence about the team goes here. Replace this
              copy with the real language later.
            </p>
          </header>

          <div className="team-list">
            {teamMembers.map((member) => (
              <article key={member.name} className="team-card">
                <div className="team-card__photo">
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} />
                  ) : (
                    <div className="team-card__placeholder">
                      <span>{getInitials(member.name)}</span>
                    </div>
                  )}
                </div>

                <div className="team-card__content">
                  <h2 className="type-h3">{member.name}</h2>
                  <p className="type-small team-card__title">
                    {member.title}
                  </p>
                  {member.location && (
                    <p className="type-small team-card__location">
                      {member.location}
                    </p>
                  )}
                  <p className="type-body team-card__bio">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
