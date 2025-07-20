import AdministrationModel from '../models/administrationModel.js';


export const getNewestAdministration = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getTypeMarche = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin.typeMarche);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getCategorieProduitMarche = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin.categorieProduitMarche);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getProduits = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin.produits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getProduitTarifsParkillo = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin.produitTarifsParkillo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getTypeDesVendeurs = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin.typeDesVendeurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getTypeDesProducteurs = async (req, res) => {
  try {
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }
    res.status(200).json(newestAdmin.typeDesProducteurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const initializeAdministration = async () => {
  try {
    const count = await AdministrationModel.countDocuments();
    
    if (count === 0) {
      const initialAdmin = new AdministrationModel({
        typeMarche: ["إنتاج", "الجملة", "ذات مصلحة وطنية"],
        categorieProduitMarche: [
          "باكورات",
          "قوارص",
          "التمور", 
          "الزيتون",
          "بقول الجافة",
          "خضر و غلال",
          "صيد البحري",
          "أسمدة فلاحية",
          "لحوم حمراء و منتوجات حيوانية",
          "دواجن و منتوجاتها"
        ],
        produits: [
          ["باكورات", ["فراولة", "فول أخضر", "بصل أخضر", "بطاطا جديدة"]],
          ["قوارص", ["برتقال مالتا", "كليمونتين", "لّيم", "بُرْتُقال أبوصرة"]],
          ["التمور", ["دقلة النور", "العليق", "الكنتي", "المجدول"]],
          ["الزيتون", ["زيتون الشملالي", "زيتون السوسي", "زيت زيتونة شملالي", "زيت زيتون عضوي"]],
          ["بقول الجافة", ["عدس", "حمص", "فول يابس", "لوبيا"]],
          ["خضر و غلال", [
            "طماطم", "فلفل", "بصل", "بطيخ", "مشمش", "خوخ", "رمان",
            "فلفل حلو", "فلفل حار", "بصل يابس", "ثوم", "بطاطا", "جزر"
          ]],
          ["صيد البحري", ["سردينة", "ورقة", "قرنيط", "تنّ", "جمبري"]],
          ["لحوم حمراء و منتوجات حيوانية", ["لحم غنم", "لحم بقري", "حليب طازج", "جبن عربي", "لبن"]],
          ["أسمدة فلاحية", ["الأمونيترات", "ثلاثي الفسفاط الرفيع", "ثاني أمونيا الفسفاط", "الأسمدة المركبة"]],
          ["دواجن و منتوجاتها", ["بيض", "لحوم بيضاء"]]
        ],
        produitTarifsParkillo: [["كيوي", 10], ["تمر", 20]],
        typeDesProducteurs: ["منتج", "شركة إنتاج", "تجمع إنتاجي"],
        typeDesVendeurs: ["وكيل بيع بالجملة", "مورد", "بائع بالتفصيل", "مجمع إنتاج"]
      });

      await initialAdmin.save();
      console.log("Initial administration data created successfully");
      return initialAdmin;
    } else {
      console.log("Administration data already exists");
      return null;
    }
  } catch (error) {
    console.error("Error initializing administration data:", error);
    throw error;
  }
};

export const updateAdministration = async (req, res) => {
  try {
    // Get the most recent administration record
    const latestRecord = await AdministrationModel.findOne().sort({ newDate: -1 });
    
    if (!latestRecord) {
      return res.status(404).json({ message: 'No administration record found to update' });
    }

    // Convert mongoose document to plain JavaScript object
    const currentData = latestRecord.toObject();
    delete currentData._id;
    delete currentData.__v;
    delete currentData.newDate;
    delete currentData.oldDate;

    // Create new record with updated fields
    const updatedRecord = await AdministrationModel.create({
      ...currentData,           // Copy all existing data
      ...req.body,              // Apply updates from request
      oldDate: latestRecord.newDate,  // Set oldDate to previous record's newDate
      newDate: new Date()        // Set current timestamp for newDate
    });

    res.status(201).json(updatedRecord);
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      details: error.errors 
    });
  }
};

export const getAdministrationHistory = async (req, res) => {
  try {
    const history = await AdministrationModel.find().sort({ newDate: -1 }); // newest first
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduitParCategorie = async (req, res) => {
  try {
    const { categorie } = req.body;
    
    // Validate input
    if (!categorie || typeof categorie !== 'string') {
      return res.status(400).json({ message: 'Category string is required' });
    }

    // Get the newest administration record
    const newestAdmin = await AdministrationModel.findOne().sort({ newDate: -1 });
    if (!newestAdmin) {
      return res.status(404).json({ message: 'No administration records found' });
    }

    // Find products for the requested category
    const products = newestAdmin.produits.find(([cat]) => cat === categorie);

    // If no products found for the given category
    if (!products) {
      return res.status(404).json({ message: 'No products found for the specified category' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
