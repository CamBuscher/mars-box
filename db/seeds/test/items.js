exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(function () {
      // Inserts seed entries
      return knex('items').insert([
        { name: 'toothpaste', packed: false },
        { name: 'sleeping bag', packed: false },
        { name: 'jetpack', packed: false }
      ]);
    })
    .then(() => console.log('Seeding complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`))
};
