import Image from 'next/image';
import { typography } from '@/lib/components';

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
      <h2 className={`${typography.h2} mb-8 text-center`}>Meet Our Team</h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="text-center">
            <div className="relative mx-auto mb-4">
              <div className="bg-secondary border-primary flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <h3 className={typography.h3}>{member.name}</h3>
            <p className={`${typography.p} text-muted-foreground`}>{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
