import Image from 'next/image';

export default function TeamMembers() {
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Sarah Miller',
      role: 'CTO & Co-Founder',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Product',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Lead Designer',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
  ];

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="text-center">
            <div className="relative mx-auto mb-4">
              <div className="bg-secondary w-32 h-32 rounded-full overflow-hidden border-4 border-primary flex items-center justify-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="text-muted-foreground">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
