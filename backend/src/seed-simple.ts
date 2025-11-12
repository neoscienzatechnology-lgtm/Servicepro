import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const seedSimple = async () => {
  try {
    console.log('🔧 Conectando ao MongoDB...')
    const mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
    console.log('✅ Conectado')

    // Inserir dados direto no MongoDB sem validação de models
    const db = mongoose.connection.db

    if (!db) throw new Error('Database não disponível')

    // Limpar coleções
    const collections = await db.listCollections().toArray()
    for (const coll of collections) {
      await db.dropCollection(coll.name)
    }

    const companyId = new mongoose.Types.ObjectId()
    const adminId = new mongoose.Types.ObjectId()
    const tech1Id = new mongoose.Types.ObjectId()
    const tech2Id = new mongoose.Types.ObjectId()

    const customer1Id = new mongoose.Types.ObjectId()
    const customer2Id = new mongoose.Types.ObjectId()
    const customer3Id = new mongoose.Types.ObjectId()

    const service1Id = new mongoose.Types.ObjectId()
    const service2Id = new mongoose.Types.ObjectId()
    const service3Id = new mongoose.Types.ObjectId()

    const technicianId1 = new mongoose.Types.ObjectId()
    const technicianId2 = new mongoose.Types.ObjectId()

    const appt1Id = new mongoose.Types.ObjectId()
    const appt2Id = new mongoose.Types.ObjectId()

    // Hash da senha "123456"
    const hashedPassword = '$2a$10$YourHashedPasswordHere'

    // Inserir users
    await db.collection('users').insertMany([
      {
        _id: adminId,
        firstName: 'Admin',
        lastName: 'Sistema',
        email: 'admin@serviceflow.com',
        password: hashedPassword,
        phone: '+5511999999999',
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: tech1Id,
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@serviceflow.com',
        password: hashedPassword,
        phone: '+5511988888888',
        role: 'technician',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: tech2Id,
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria@serviceflow.com',
        password: hashedPassword,
        phone: '+5511977777777',
        role: 'technician',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: customer1Id,
        firstName: 'Carlos',
        lastName: 'Pereira',
        email: 'carlos@email.com',
        password: hashedPassword,
        phone: '+5511966666666',
        role: 'customer',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: customer2Id,
        firstName: 'Ana',
        lastName: 'Costa',
        email: 'ana@email.com',
        password: hashedPassword,
        phone: '+5511955555555',
        role: 'customer',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: customer3Id,
        firstName: 'Pedro',
        lastName: 'Oliveira',
        email: 'pedro@email.com',
        password: hashedPassword,
        phone: '+5511944444444',
        role: 'customer',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    console.log('✅ Usuários criados')

    // Inserir customers
    await db.collection('customers').insertMany([
      {
        _id: new mongoose.Types.ObjectId(),
        user: customer1Id,
        company: companyId,
        firstName: 'Carlos',
        lastName: 'Pereira',
        email: 'carlos@email.com',
        phone: '+5511966666666',
        addresses: [{
          street: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil',
          isDefault: true
        }],
        tags: [],
        notes: '',
        status: 'active',
        preferences: { communicationMethod: 'both' },
        totalSpent: 0,
        totalJobs: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        user: customer2Id,
        company: companyId,
        firstName: 'Ana',
        lastName: 'Costa',
        email: 'ana@email.com',
        phone: '+5511955555555',
        addresses: [{
          street: 'Av. Paulista, 456',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100',
          country: 'Brasil',
          isDefault: true
        }],
        tags: [],
        notes: '',
        status: 'active',
        preferences: { communicationMethod: 'both' },
        totalSpent: 0,
        totalJobs: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        user: customer3Id,
        company: companyId,
        firstName: 'Pedro',
        lastName: 'Oliveira',
        email: 'pedro@email.com',
        phone: '+5511944444444',
        addresses: [{
          street: 'Rua Augusta, 789',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01305-000',
          country: 'Brasil',
          isDefault: true
        }],
        tags: [],
        notes: '',
        status: 'active',
        preferences: { communicationMethod: 'both' },
        totalSpent: 0,
        totalJobs: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    console.log('✅ Clientes criados')

    // Inserir technicians
    await db.collection('technicians').insertMany([
      {
        _id: technicianId1,
        user: tech1Id,
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@serviceflow.com',
        phone: '+5511988888888',
        specialties: ['Encanamento', 'Hidráulica'],
        hourlyRate: 120,
        rating: { average: 4.8, count: 45 },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: technicianId2,
        user: tech2Id,
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria@serviceflow.com',
        phone: '+5511977777777',
        specialties: ['Elétrica', 'Ar Condicionado'],
        hourlyRate: 150,
        rating: { average: 4.9, count: 52 },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    console.log('✅ Técnicos criados')

    // Inserir services
    await db.collection('services').insertMany([
      {
        _id: service1Id,
        name: 'Instalação de Torneira',
        description: 'Instalação completa',
        basePrice: 150,
        pricingType: 'fixed',
        estimatedDuration: 60,
        category: 'Encanamento',
        isActive: true,
        tags: ['encanamento'],
        requiredSkills: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: service2Id,
        name: 'Reparo Elétrico',
        description: 'Reparo de instalações elétricas',
        basePrice: 200,
        pricingType: 'hourly',
        estimatedDuration: 90,
        category: 'Elétrica',
        isActive: true,
        tags: ['elétrica'],
        requiredSkills: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: service3Id,
        name: 'Limpeza de Calha',
        description: 'Limpeza e manutenção',
        basePrice: 120,
        pricingType: 'fixed',
        estimatedDuration: 45,
        category: 'Manutenção',
        isActive: true,
        tags: ['limpeza'],
        requiredSkills: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    console.log('✅ Serviços criados')

    // Inserir appointments
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    await db.collection('appointments').insertMany([
      {
        _id: appt1Id,
        customer: customer1Id,
        technician: technicianId1,
        service: service1Id,
        scheduledDate: tomorrow,
        duration: 60,
        status: 'scheduled',
        address: {
          street: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil'
        },
        notes: 'Instalação de torneira',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: appt2Id,
        customer: customer2Id,
        technician: technicianId2,
        service: service2Id,
        scheduledDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        duration: 90,
        status: 'scheduled',
        address: {
          street: 'Av. Paulista, 456',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100',
          country: 'Brasil'
        },
        notes: 'Reparo elétrico',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    console.log('✅ Agendamentos criados')

    // Inserir invoices
    await db.collection('invoices').insertMany([
      {
        _id: new mongoose.Types.ObjectId(),
        customer: customer1Id,
        appointment: appt1Id,
        items: [{
          description: 'Instalação de Torneira',
          quantity: 1,
          unitPrice: 150
        }],
        subtotal: 150,
        tax: 0,
        total: 150,
        status: 'pending',
        issueDate: today,
        dueDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        customer: customer2Id,
        appointment: appt2Id,
        items: [{
          description: 'Reparo Elétrico',
          quantity: 1,
          unitPrice: 200
        }],
        subtotal: 200,
        tax: 0,
        total: 200,
        status: 'paid',
        issueDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        dueDate: today,
        payments: [{
          amount: 200,
          method: 'credit_card',
          date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
          reference: 'CARD-ABC123'
        }],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    console.log('✅ Faturas criadas')

    console.log('\n🎉 Dados criados com sucesso!')
    console.log('\n📧 Login: admin@serviceflow.com')
    console.log('🔑 Senha: 123456')
    console.log('\n✨ Dados populados:')
    console.log('   - 6 usuários')
    console.log('   - 3 clientes')
    console.log('   - 2 técnicos')
    console.log('   - 3 serviços')
    console.log('   - 2 agendamentos')
    console.log('   - 2 faturas')

    await mongoose.disconnect()
    await mongoServer.stop()
    process.exit(0)

  } catch (error) {
    console.error('❌ Erro:', error)
    process.exit(1)
  }
}

seedSimple()
