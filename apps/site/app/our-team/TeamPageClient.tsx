"use client";

import "@styles/team.css";
import Image from "next/image";
import { useMemo } from "react";
import { useAdminTeamMembers } from "@admin/AdminTeamStore";

export default function TeamPageClient() {
  const { items } = useAdminTeamMembers();

  const { founders, others } = useMemo(() => {
    const published = items.filter((member) => member.status === "Published");
    const foundersList = published.filter((member) => member.isFounder);
    const othersList = published.filter((member) => !member.isFounder);
    return { founders: foundersList, others: othersList };
  }, [items]);

  return (
    <main>
      <section className="c-section team-section">
        <div className="c-container">
          <h1 className="type-h1">Our Team</h1>

          <div className="team-intro">
            <p className="type-body">
              As former Senior Advisors to Members of the United States Senate,
              we have experience working on Congressional issues that include,
              but are not limited to, geospatial, natural resources, emergency
              management, and natural disaster response, agriculture,
              transportation, appropriations, and programmatic grant funding. As
              legislative leads in these areas, we worked closely with federal
              departments and agencies on related programs and efforts, as well
              as outside companies, foundations, non-profits, county, state, and
              tribal governments, among others.
            </p>
            <p className="type-body">
              Since leaving government service, we have collectively
              represented, as lobbyists and advisors, a large geospatial
              industry association, non-geospatial-related industry
              associations, non-profit and charitable organizations, tribal
              governments, and individual companies, to name a few.
            </p>
            <br />
            <hr />
          </div>

          {founders.length > 0 && (
            <section className="team-founders">
              <h2 className="type-h2b team-founders__heading">Founders</h2>

              {founders.map((member) => (
                <article
                  key={member.id}
                  className="team-card team-card--founder"
                >
                  {member.imageUrl && (
                    <div className="team-card__photo">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        sizes="(max-width: 800px) 220px, 260px"
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="team-card__body">
                    <h3 className="type-h3">{member.name}</h3>
                    <h5 className="type-h5 team-card__title">{member.title}</h5>
                    {member.location && (
                      <p className="type-small team-card__location">
                        {member.location}
                      </p>
                    )}
                    {member.bio.map((para, idx) => (
                      <p
                        key={idx}
                        className="type-body team-card__bio team-card__bio--founder"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </section>
          )}

          {others.length > 0 && (
            <section className="team-grid-section">
              <hr />
              <h2 className="type-h2b team-grid__heading">Specialists</h2>

              <div className="team-grid">
                {others.map((member) => (
                  <article key={member.id} className="team-card">
                    {member.imageUrl && (
                      <div className="team-card__photo">
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          sizes="(max-width: 800px) 220px, 160px"
                          unoptimized
                        />
                      </div>
                    )}

                    <div className="team-card__body">
                      <h3 className="type-h3">{member.name}</h3>
                      <h5 className="type-h5 team-card__title">
                        {member.title}
                      </h5>
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
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
