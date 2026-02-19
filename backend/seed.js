const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Lawyer = require('./models/Lawyer');
const Expertise = require('./models/Expertise');

const MONGO_URI =
    process.env.MONGO_URI || 'mongodb://localhost:27017/attorney-portfolio';

const expertiseSectors = [
    {
        name: 'Financial Law',
        description:
            'Banking regulations, securities, investment compliance, and financial dispute resolution.',
        icon: 'DollarSign',
        lawyerCount: 2,
    },
    {
        name: 'Agricultural Law',
        description:
            'Land rights, farm regulations, agricultural trade, and environmental compliance.',
        icon: 'Wheat',
        lawyerCount: 1,
    },
    {
        name: 'Corporate Law',
        description:
            'Mergers & acquisitions, corporate governance, contracts, and commercial litigation.',
        icon: 'Building2',
        lawyerCount: 2,
    },
    {
        name: 'Criminal Law',
        description:
            'Defense representation, prosecution support, white-collar crime, and appeals.',
        icon: 'Shield',
        lawyerCount: 2,
    },
    {
        name: 'Real Estate Law',
        description:
            'Property transactions, zoning disputes, landlord-tenant law, and title insurance.',
        icon: 'Home',
        lawyerCount: 1,
    },
    {
        name: 'Immigration Law',
        description:
            'Visa applications, citizenship, deportation defense, and asylum cases.',
        icon: 'Globe',
        lawyerCount: 2,
    },
    {
        name: 'Family Law',
        description:
            'Divorce proceedings, child custody, adoption, and domestic agreements.',
        icon: 'Heart',
        lawyerCount: 1,
    },
    {
        name: 'Intellectual Property',
        description:
            'Patent filings, trademark registration, copyright protection, and IP litigation.',
        icon: 'Lightbulb',
        lawyerCount: 1,
    },
];

const lawyersData = [
    {
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@lawfirm.com',
        phone: '+1-555-0101',
        bio: 'Senior partner specializing in financial regulations with 15 years of experience in SEC compliance and banking law.',
        sectors: ['Financial Law', 'Corporate Law'],
        experience: 15,
        rating: 4.9,
        available: true,
    },
    {
        name: 'James Rodriguez',
        email: 'james.rodriguez@lawfirm.com',
        phone: '+1-555-0102',
        bio: 'Expert in agricultural trade disputes and environmental compliance for farming operations.',
        sectors: ['Agricultural Law', 'Real Estate Law'],
        experience: 10,
        rating: 4.7,
        available: true,
    },
    {
        name: 'Elena Vasquez',
        email: 'elena.vasquez@lawfirm.com',
        phone: '+1-555-0103',
        bio: 'Criminal defense attorney with a track record of successful jury trials and appeals.',
        sectors: ['Criminal Law'],
        experience: 12,
        rating: 4.8,
        available: true,
    },
    {
        name: 'Michael Chen',
        email: 'michael.chen@lawfirm.com',
        phone: '+1-555-0104',
        bio: 'Corporate transactions specialist handling M&A deals for Fortune 500 companies.',
        sectors: ['Corporate Law', 'Financial Law'],
        experience: 18,
        rating: 5.0,
        available: true,
    },
    {
        name: 'Amara Okafor',
        email: 'amara.okafor@lawfirm.com',
        phone: '+1-555-0105',
        bio: 'Immigration law expert helping families navigate visa processes and citizenship applications.',
        sectors: ['Immigration Law', 'Family Law'],
        experience: 8,
        rating: 4.6,
        available: true,
    },
    {
        name: 'David Hoffman',
        email: 'david.hoffman@lawfirm.com',
        phone: '+1-555-0106',
        bio: 'Intellectual property litigator with expertise in patent law for tech companies.',
        sectors: ['Intellectual Property', 'Corporate Law'],
        experience: 14,
        rating: 4.8,
        available: true,
    },
    {
        name: 'Priya Sharma',
        email: 'priya.sharma@lawfirm.com',
        phone: '+1-555-0107',
        bio: 'Family law specialist focused on child custody disputes and adoption proceedings.',
        sectors: ['Family Law'],
        experience: 9,
        rating: 4.5,
        available: true,
    },
    {
        name: 'Robert King',
        email: 'robert.king@lawfirm.com',
        phone: '+1-555-0108',
        bio: 'White-collar crime defense attorney with experience in federal fraud investigations.',
        sectors: ['Criminal Law', 'Financial Law'],
        experience: 20,
        rating: 4.9,
        available: false,
    },
    {
        name: 'Lisa Park',
        email: 'lisa.park@lawfirm.com',
        phone: '+1-555-0109',
        bio: 'Real estate transaction attorney handling commercial and residential property deals.',
        sectors: ['Real Estate Law'],
        experience: 7,
        rating: 4.4,
        available: true,
    },
    {
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@lawfirm.com',
        phone: '+1-555-0110',
        bio: 'Immigration attorney specializing in asylum cases and deportation defense.',
        sectors: ['Immigration Law', 'Criminal Law'],
        experience: 11,
        rating: 4.7,
        available: true,
    },
    {
        name: 'Catherine Wells',
        email: 'catherine.wells@lawfirm.com',
        phone: '+1-555-0111',
        bio: 'Agricultural law expert advising on sustainable farming regulations and land rights.',
        sectors: ['Agricultural Law'],
        experience: 13,
        rating: 4.6,
        available: true,
    },
    {
        name: 'Thomas Blake',
        email: 'thomas.blake@lawfirm.com',
        phone: '+1-555-0112',
        bio: 'Patent attorney with a background in software engineering and tech IP protection.',
        sectors: ['Intellectual Property'],
        experience: 6,
        rating: 4.3,
        available: true,
    },
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Lawyer.deleteMany({});
        await Expertise.deleteMany({});

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@attorneyportfolio.com',
            password: 'admin123',
            role: 'admin',
        });
        console.log('✅ Admin user created (admin@attorneyportfolio.com / admin123)');

        // Create expertise sectors
        await Expertise.insertMany(expertiseSectors);
        console.log(`✅ ${expertiseSectors.length} expertise sectors created`);

        // Create attorney users and lawyer profiles
        for (const lawyerData of lawyersData) {
            const user = await User.create({
                name: lawyerData.name,
                email: lawyerData.email,
                password: 'lawyer123',
                role: 'attorney',
            });

            await Lawyer.create({
                ...lawyerData,
                userId: user._id,
            });
        }
        console.log(`✅ ${lawyersData.length} lawyers created`);

        console.log('\n🎉 Seed complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
}

seed();
