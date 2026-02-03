const sequelize = require('./src/db');
const Product = require('./src/models/Product');

const products = [
  {
    "name": "Honda Activa",
    "code": "BHACT110-01",
    "category": "Black"
  },
  {
    "name": "Honda Activa 3G/4G/5G",
    "code": "BHACT110-02",
    "category": "Black"
  },
  {
    "name": "Honda Activa 6G",
    "code": "BHACT1106G-03",
    "category": "Black"
  },
  {
    "name": "Honda Activa 6G",
    "code": "BHACT1106G-04",
    "category": "Black"
  },
  {
    "name": "Honda Activa 6G",
    "code": "BHACT1106G-05",
    "category": "Black"
  },
  {
    "name": "Honda Activa 125",
    "code": "BHACT125-01",
    "category": "Black"
  },
  {
    "name": "Honda Activa 125",
    "code": "BHACT125-02",
    "category": "Black"
  },
  {
    "name": "Honda Dio",
    "code": "BHDIO110-01",
    "category": "Black"
  },
  {
    "name": "Honda Dio 125",
    "code": "BHDIO125-01",
    "category": "Black"
  },
  {
    "name": "Honda Grazia",
    "code": "BHGRA125-01",
    "category": "Black"
  },
  {
    "name": "Honda Aviator",
    "code": "BHAVI110-01",
    "category": "Black"
  },
  {
    "name": "Honda Navi",
    "code": "BHNAV110-01",
    "category": "Black"
  },
  {
    "name": "Honda Cliq",
    "code": "BHCLI110-01",
    "category": "Black"
  },
  {
    "name": "Honda QC 1",
    "code": "BHQC1-01",
    "category": "Black"
  },
  {
    "name": "TVS Jupiter",
    "code": "BTJUP110-01",
    "category": "Black"
  },
  {
    "name": "TVS Jupiter 125",
    "code": "BTJUP125-01",
    "category": "Black"
  },
  {
    "name": "TVS Jupiter 125",
    "code": "BTJUP125-02",
    "category": "Black"
  },
  {
    "name": "TVS Ntorq",
    "code": "BTNTOR125-01",
    "category": "Black"
  },
  {
    "name": "TVS Ntorq",
    "code": "BTNTOR125-02",
    "category": "Black"
  },
  {
    "name": "TVS Ntorq",
    "code": "BTNTOR125-03",
    "category": "Black"
  },
  {
    "name": "TVS Ntorq",
    "code": "BTNTOR125-04",
    "category": "Black"
  },
  {
    "name": "TVS Zest",
    "code": "BTZES110-01",
    "category": "Black"
  },
  {
    "name": "TVS Wego",
    "code": "BTWEG110",
    "category": "Black"
  },
  {
    "name": "Suzuki Access 2024",
    "code": "BSACC125-01",
    "category": "Black"
  },
  {
    "name": "Suzuki Access 2025",
    "code": "BSACC125-01",
    "category": "Black"
  },
  {
    "name": "Suzuki Access 2025",
    "code": "BSACC125-02",
    "category": "Black"
  },
  {
    "name": "Suzuki Burgman",
    "code": "BSBUR125-01",
    "category": "Black"
  },
  {
    "name": "Suzuki Burgman",
    "code": "BSBUR125-02",
    "category": "Black"
  },
  {
    "name": "Suzuki Avenis",
    "code": "BSAVE125-01",
    "category": "Black"
  },
  {
    "name": "Suzuki Avenis",
    "code": "BSAVE125-02",
    "category": "Black"
  },
  {
    "name": "Suzuki Swish",
    "code": "BSSWI125",
    "category": "Black"
  },
  {
    "name": "Suzuki Let\u2019s",
    "code": "BSLET110",
    "category": "Black"
  },
  {
    "name": "Hero Pleasure Plus",
    "code": "BHPLE110-01",
    "category": "Black"
  },
  {
    "name": "Hero Destini 2024",
    "code": "BHDES125-01",
    "category": "Black"
  },
  {
    "name": "Hero Destini 2025",
    "code": "BHDES125-02",
    "category": "Black"
  },
  {
    "name": "Hero Maestro Edge",
    "code": "BHMAE110",
    "category": "Black"
  },
  {
    "name": "Hero Maestro Edge 125",
    "code": "BHMAE125",
    "category": "Black"
  },
  {
    "name": "Hero Xoom 2024",
    "code": "BHXOO110-01",
    "category": "Black"
  },
  {
    "name": "Hero Xoom 125 2025",
    "code": "BHXOO125-01",
    "category": "Black"
  },
  {
    "name": "Hero Duet",
    "code": "BHDUE110",
    "category": "Black"
  },
  {
    "name": "Hero Vida V1",
    "code": "BHVIDV1-01",
    "category": "Black"
  },
  {
    "name": "Hero Vida VX2",
    "code": "BHVIDVX2-01",
    "category": "Black"
  },
  {
    "name": "Yamaha Fascino",
    "code": "BYFAS110-01",
    "category": "Black"
  },
  {
    "name": "Yamaha Fascino 125",
    "code": "BYFAS125-01",
    "category": "Black"
  },
  {
    "name": "Yamaha RayZR",
    "code": "BYRAY125-01",
    "category": "Black"
  },
  {
    "name": "Yamaha Aerox",
    "code": "BYAER155",
    "category": "Black"
  },
  {
    "name": "Yamaha Ray",
    "code": "BYRAY110",
    "category": "Black"
  },
  {
    "name": "Bajaj Chetak (EV)",
    "code": "BBCHET2901-01",
    "category": "Black"
  },
  {
    "name": "Bajaj Chetak (EV)",
    "code": "BBCHET3501-01",
    "category": "Black"
  },
  {
    "name": "Bajaj Chetak (EV)",
    "code": "BBCHET2501-01",
    "category": "Black"
  },
  {
    "name": "Bajaj Chetak",
    "code": "BBCHET150",
    "category": "Black"
  },
  {
    "name": "Bajaj Super",
    "code": "BBSUP150",
    "category": "Black"
  },
  {
    "name": "LML Supremo",
    "code": "BLML150",
    "category": "Black"
  },
  {
    "name": "Ola S1",
    "code": "BOS1-01",
    "category": "Black"
  },
  {
    "name": "Ola S1",
    "code": "BOS1-02",
    "category": "Black"
  },
  {
    "name": "Ather 450X",
    "code": "BA450-01",
    "category": "Black"
  },
  {
    "name": "Ather 450X",
    "code": "BA450-02",
    "category": "Black"
  },
  {
    "name": "Honda Activa",
    "code": "CHACT110-01",
    "category": "Colored"
  },
  {
    "name": "Honda Activa 3G/4G/5G",
    "code": "CHACT110-02",
    "category": "Colored"
  },
  {
    "name": "Honda Activa 6G",
    "code": "CHACT1106G-03",
    "category": "Colored"
  },
  {
    "name": "Honda Activa 6G",
    "code": "CHACT1106G-04",
    "category": "Colored"
  },
  {
    "name": "Honda Activa 6G",
    "code": "CHACT1106G-05",
    "category": "Colored"
  },
  {
    "name": "Honda Activa 125",
    "code": "CHACT125-01",
    "category": "Colored"
  },
  {
    "name": "Honda Activa 125",
    "code": "CHACT125-02",
    "category": "Colored"
  },
  {
    "name": "Honda Dio",
    "code": "CHDIO110-01",
    "category": "Colored"
  },
  {
    "name": "Honda Dio 125",
    "code": "CHDIO125-01",
    "category": "Colored"
  },
  {
    "name": "Honda Grazia",
    "code": "CHGRA125-01",
    "category": "Colored"
  },
  {
    "name": "Honda Aviator",
    "code": "CHAVI110-01",
    "category": "Colored"
  },
  {
    "name": "Honda QC 1",
    "code": "CHQC1-01",
    "category": "Colored"
  },
  {
    "name": "TVS Jupiter",
    "code": "CTJUP110-01",
    "category": "Colored"
  },
  {
    "name": "TVS Jupiter 125",
    "code": "CTJUP125-01",
    "category": "Colored"
  },
  {
    "name": "TVS Jupiter 125",
    "code": "CTJUP125-02",
    "category": "Colored"
  },
  {
    "name": "TVS Ntorq",
    "code": "CTNTOR125-01",
    "category": "Colored"
  },
  {
    "name": "TVS Ntorq",
    "code": "CTNTOR125-02",
    "category": "Colored"
  },
  {
    "name": "TVS Ntorq",
    "code": "CTNTOR125-03",
    "category": "Colored"
  },
  {
    "name": "TVS Ntorq",
    "code": "CTNTOR125-04",
    "category": "Colored"
  },
  {
    "name": "Suzuki Access 2024",
    "code": "CSACC125-01",
    "category": "Colored"
  },
  {
    "name": "Suzuki Access 2025",
    "code": "CSACC125-01",
    "category": "Colored"
  },
  {
    "name": "Suzuki Access 2025",
    "code": "CSACC125-02",
    "category": "Colored"
  },
  {
    "name": "Suzuki Burgman",
    "code": "CSBUR125-01",
    "category": "Colored"
  },
  {
    "name": "Suzuki Burgman",
    "code": "CSBUR125-02",
    "category": "Colored"
  },
  {
    "name": "Suzuki Avenis",
    "code": "CSAVE125-01",
    "category": "Colored"
  },
  {
    "name": "Suzuki Avenis",
    "code": "CSAVE125-02",
    "category": "Colored"
  },
  {
    "name": "Suzuki Swish",
    "code": "CSSWI125",
    "category": "Colored"
  },
  {
    "name": "Suzuki Let\u2019s",
    "code": "CSLET110",
    "category": "Colored"
  },
  {
    "name": "Hero Pleasure Plus",
    "code": "CHPLE110-01",
    "category": "Colored"
  },
  {
    "name": "Hero Destini 2024",
    "code": "CHDES125-01",
    "category": "Colored"
  },
  {
    "name": "Hero Destini 2025",
    "code": "CHDES125-01",
    "category": "Colored"
  },
  {
    "name": "Hero Maestro Edge",
    "code": "CHMAE110",
    "category": "Colored"
  },
  {
    "name": "Hero Maestro Edge 125",
    "code": "CHMAE125",
    "category": "Colored"
  },
  {
    "name": "Hero Xoom 2024",
    "code": "CHXOO110-01",
    "category": "Colored"
  },
  {
    "name": "Hero Xoom 125 2025",
    "code": "CHXOO125-01",
    "category": "Colored"
  },
  {
    "name": "Hero Duet",
    "code": "CHDUET110",
    "category": "Colored"
  },
  {
    "name": "Hero Vida V1",
    "code": "CHVIDV1-01",
    "category": "Colored"
  },
  {
    "name": "Hero Vida VX2",
    "code": "CHVIDVX2-01",
    "category": "Colored"
  },
  {
    "name": "Yamaha Fascino 125",
    "code": "CYFAS125-01",
    "category": "Colored"
  },
  {
    "name": "Yamaha RayZR",
    "code": "CYRAY125-01",
    "category": "Colored"
  },
  {
    "name": "Bajaj Chetak (EV)",
    "code": "CBCHET2901-01",
    "category": "Colored"
  },
  {
    "name": "Bajaj Chetak (EV)",
    "code": "CBCHET3501-01",
    "category": "Colored"
  },
  {
    "name": "Bajaj Chetak (EV)",
    "code": "CBCHET2501-01",
    "category": "Colored"
  },
  {
    "name": "Ola S1",
    "code": "COS1-01",
    "category": "Colored"
  },
  {
    "name": "Ola S1",
    "code": "COS1-02",
    "category": "Colored"
  },
  {
    "name": "Ather 450X",
    "code": "CA450-01",
    "category": "Colored"
  },
  {
    "name": "Ather 450X",
    "code": "CA450-02",
    "category": "Colored"
  }

  




  // Add ALL remaining from your docs here (open Word, copy rows, format as { name: 'Model', code: 'Code', category: 'Black/Colored' })
  // e.g., { name: 'Dio', code: 'BHDIO-01', category: 'Black' },
  // For 7D: If any code starts with 7, category: '7D'
];

async function seed() {
  await sequelize.sync({ alter: true });
  
  for (const product of products) {
    try {
      // Auto-map category if not set (from code)
      if (!product.category) {
        const firstChar = product.code.charAt(0).toUpperCase();
        product.category = firstChar === 'B' ? 'Black' : firstChar === 'C' ? 'Colored' : firstChar === '7' ? '7D' : 'TPE';
      }
      await Product.upsert(product); // Insert or update if exists (by name/code unique)
      console.log(`Added/Updated: ${product.code} - ${product.name} (${product.category})`);
    } catch (err) {
      console.error(`Error for ${product.name}:`, err.message);
    }
  }
  
  console.log('Seeding complete!');
  process.exit(0);
}

seed();
