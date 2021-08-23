import mongoose from "mongoose";
import autoIncrement from 'mongoose-auto-increment';
mongoose.connect('mongodb://localhost:27017/simple_board', { 
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
autoIncrement.initialize(db);
db.on('error', console.error.bind(console, 'Connection Error: '));
db.once('open', () => {
    console.log('DB Connected');
});

export default mongoose;