import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

dotenv.config()

const seedProduction = async () => {
  try {
    console.log('🔧 Conectando ao MongoDB Atlas...')
    
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI não encontrada')
    }
    
    await mongoose.connect(mongoUri)
    console.log('✅ Conectado ao MongoDB Atlas')

    const db = mongoose.connection.db
    if (!db) throw new Error('Database não disponível')

    // Limpar coleções existentes
    console.log('🗑️  Limpando dados existentes...')
    const collections = await db.listCollections().toArray()
    for (const coll of collections) {
      await db.dropCollection(coll.name)
    }

    // IDs
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
    const hashedPassword = await bcrypt.hash('123456', 10)

    console.log('👤 Criando usuários...')
    await db.collection('users').insertMany([
      {
        _id: adminId,
        firstName: 'Admin',
        lastName: 'Sistema',
        email: 'admin@serviceflow.com',
        password: hashedPassword,
        role: 'admin',
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: tech1Id,
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@serviceflow.com',
        password: hashedPassword,
        role: 'technician',
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: tech2Id,
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria@serviceflow.com',
        password: hashedPassword,
        role: 'technician',
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    console.log('🏢 Criando empresa...')
    await db.collection('companies').insertOne({
      _id: companyId,
      name: 'ServiceFlow Pro Demo',
      email: 'contato@serviceflow.com',
      phone: '(11) 99999-9999',
      address: {
        street: 'Av. Paulista, 1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log('👥 Criando clientes...')
    await db.collection('customers').insertMany([
      {
        _id: customer1Id,
        firstName: 'Carlos',
        lastName: 'Oliveira',
        email: 'carlos@email.com',
        phone: '(11) 98888-8888',
        address: {
          street: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567'
        },
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: customer2Id,
        firstName: 'Ana',
        lastName: 'Costa',
        email: 'ana@email.com',
        phone: '(11) 97777-7777',
        address: {
          street: 'Av. Brasil, 456',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '04567-890'
        },
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: customer3Id,
        firstName: 'Pedro',
        lastName: 'Souza',
        email: 'pedro@email.com',
        phone: '(11) 96666-6666',
        address: {
          street: 'Rua XV de Novembro, 789',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01013-001'
        },
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    console.log('🛠️  Criando serviços...')
    await db.collection('services').insertMany([
      {
        _id: service1Id,
        name: 'Manutenção de Ar Condicionado',
        description: 'Limpeza e manutenção completa',
        price: 150,
        duration: 120,
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: service2Id,
        name: 'Instalação de Ventilador',
        description: 'Instalação e configuração',
        price: 80,
        duration: 60,
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: service3Id,
        name: 'Reparo de Aquecedor',
        description: 'Diagnóstico e reparo',
        price: 200,
        duration: 180,
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    console.log('👨‍🔧 Criando técnicos...')
    await db.collection('technicians').insertMany([
      {
        _id: technicianId1,
        user: tech1Id,
        specialties: ['Ar Condicionado', 'Ventilação'],
        available: true,
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: technicianId2,
        user: tech2Id,
        specialties: ['Aquecimento', 'Ar Condicionado'],
        available: true,
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    console.log('📅 Criando agendamentos...')
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)

    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    nextWeek.setHours(14, 0, 0, 0)

    await db.collection('appointments').insertMany([
      {
        _id: appt1Id,
        customer: customer1Id,
        technician: technicianId1,
        service: service1Id,
        scheduledDate: tomorrow,
        startTime: '09:00',
        endTime: '11:00',
        status: 'scheduled',
        notes: 'Cliente preferencial - ligar antes',
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: appt2Id,
        customer: customer2Id,
        technician: technicianId2,
        service: service3Id,
        scheduledDate: nextWeek,
        startTime: '14:00',
        endTime: '17:00',
        status: 'scheduled',
        notes: 'Verificar aquecedor a gás',
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    console.log('💰 Criando faturas...')
    await db.collection('invoices').insertMany([
      {
        customer: customer1Id,
        appointment: appt1Id,
        service: service1Id,
        amount: 150,
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        items: [
          {
            description: 'Manutenção de Ar Condicionado',
            quantity: 1,
            price: 150
          }
        ],
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        customer: customer3Id,
        service: service2Id,
        amount: 80,
        status: 'paid',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        items: [
          {
            description: 'Instalação de Ventilador',
            quantity: 1,
            price: 80
          }
        ],
        company: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    console.log('\n✅ Dados de demonstração criados com sucesso!')
    console.log('\n📋 Resumo:')
    console.log('   - 1 empresa')
    console.log('   - 3 usuários (admin, 2 técnicos)')
    console.log('   - 3 clientes')
    console.log('   - 3 serviços')
    console.log('   - 2 técnicos')
    console.log('   - 2 agendamentos')
    console.log('   - 2 faturas')
    console.log('\n🔑 Login de administrador:')
    console.log('   Email: admin@serviceflow.com')
    console.log('   Senha: 123456')

    await mongoose.disconnect()
    console.log('\n👋 Desconectado do MongoDB')
    process.exit(0)

  } catch (error) {
    console.error('❌ Erro:', error)
    process.exit(1)
  }
}

seedProduction()
